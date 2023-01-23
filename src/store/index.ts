import { Storage } from "@ionic/storage";

export default class Store
{
  private storage: Storage | undefined;

  public constructor() 
  {
    const newStorage = new Storage({
      name: 'tododb'
    })

    newStorage
      .create()
      .then((response) => {
        this.storage = response
      })
  }

  public getStore() : Storage | undefined
  {
    return this.storage;
  }
}