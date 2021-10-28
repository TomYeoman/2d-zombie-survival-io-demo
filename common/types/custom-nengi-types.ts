// custom-fc.ts : enhances declaration of FC namespace
import nengi from 'nengi'
import PlayerEntity from '../entity/PlayerEntity'

type View = {
    x: number,
    y: number,
    halfWidth: number,
    halfHeight: number
}

interface EDictionary {
    /**
     * Iterates through the EDictionary
     * @param fn Provides (obj: any, i: number) to your function
     */
    forEach(fn: (obj: ExtendedNengiTypes.Client, i: number) => void): void

    /**
     * Adds an object to the EDictionary. The object *MUST* have a nid/id property as defined in the nengiConfig
     * @param obj
     */
    add(obj: any): void

    /**
     * Removes an object from the EDictionary by reference
     * @param obj
     */
    remove(obj: any): void

    /**
     * Removes an object from the EDictionary by type
     * @param id
     */
    removeById(id: number): void

    /**
     * Provides access to the underlying data as an array. There is no performance penalty as the underlying data *is* an array. Do not mutate it, use add and remove instead.
     */
    toArray(): any[]
}

export declare namespace ExtendedNengiTypes {
    class Instance extends nengi.Instance {
        emit(...args: any[]):void
        onConnect(fn: (client:any, data:any, callback:any) => void): void
        onDisconnect(fn: (client: Client) => void): void
        getNextCommand(): any
        createChannel(): any
        set(entityId: string, entity: any): void
        clients: EDictionary
        _entities: EDictionary
    }
    class Client extends nengi.Client {
       onConnect(fn: (res:any) => void): void
       onClose(fn: () => void): void
       entitySelf: PlayerEntity
       entityPhaser: any
       view: View
        name: string
        isAlive: boolean
        selectedSlot: number
    }

    let testProperty: any;
}
