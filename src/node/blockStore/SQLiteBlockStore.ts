import {Model, DataTypes, ModelCtor, ModelOptions, Sequelize} from 'sequelize'
import * as envPaths from 'env-paths'
import * as path from 'path'
import {dbPath} from '../../lib/Paths'
import {ModelAttributes} from 'sequelize/types/lib/model'
import Block from '../../lib/Block'
import BlockHash from '../../lib/BlockHash'
import {BlockStoreInterface} from '../../secure/BlockStore'

interface SQLiteBlockStoreOptions {

}

interface TableDefinition {
    readonly name: string
    readonly attributes: ModelAttributes
    readonly options?: ModelOptions
}

const tableDefinitions: TableDefinition[] = [
    {
        name: 'Block',
        attributes: {
            hash: DataTypes.BLOB,
            account: DataTypes.BLOB,
        }
    }
]

// Tradeoffs:
// Pros:
// - simple
// - high level
// Cons:
// - slower
// - different implementation than original node's lmdb/rocksdb nosql/document store
// Performance optimization is planned for later, once this node is working and running
export class SQLiteBlockStore implements BlockStoreInterface {
    private readonly BlockModel: ModelCtor<Model<any, any>>

    private constructor(options: SQLiteBlockStoreOptions, private readonly dbHandle: Sequelize) {
        this.BlockModel = dbHandle.define('Block', {
            hash: DataTypes.BLOB,
            account: DataTypes.BLOB,
        })
    }

    static async from(options: SQLiteBlockStoreOptions): Promise<SQLiteBlockStore> {
        const dbHandle = new Sequelize({
            dialect: 'sqlite',
            storage: dbPath,
        })

        await dbHandle.authenticate()
        // this.createTables(dbHandle)

        await dbHandle.sync()

        return new SQLiteBlockStore(options, dbHandle)
    }

    private static createTables(dbHandle: Sequelize) {
        tableDefinitions.forEach((tableDefinition) => {
            dbHandle.define(tableDefinition.name, tableDefinition.attributes, tableDefinition.options)
        })
    }

    async putBlock(block: Block): Promise<Model<any>> {
        return this.dbHandle.model('Block').create({
            hash: block.getHash().asBuffer(),
            account: block.getAccount().publicKey.asBuffer()
        })
    }

    async confirmBlock(block: Block) {

    }

    async getBlock(hash: BlockHash): Promise<Block> {
        const maybeBlockModel = await this.BlockModel.findOne({
            where: {
                hash: hash.asBuffer()
            }
        })
        if(!maybeBlockModel) {
            return Promise.reject()
        }

        // FIXME
        // return new Block
    }
}
