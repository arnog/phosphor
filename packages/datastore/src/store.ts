/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2018, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
import {
  IIterable, IIterator
} from '@phosphor/algorithm';

import {
  ReadonlyJSONValue
} from '@phosphor/coreutils';

import {
  IMessageHandler, Message
} from '@phosphor/messaging';

import {
  ISignal
} from '@phosphor/signaling';

import {
  List
} from './list';

import {
  Map
} from './map';

import {
  Record
} from './record';

import {
  Schema
} from './schema';

import {
  Table
} from './table';

import {
  Text
} from './text';


/**
 * A multi-user collaborative data store.
 *
 * #### Notes
 * A store is structured in a maximally flat way using a hierarchy
 * of tables, records, and fields. Internally, the object graph is
 * synchronized among all users via CRDT algorithms.
 *
 * https://en.wikipedia.org/wiki/Conflict-free_replicated_data_type
 * https://hal.inria.fr/file/index/docid/555588/filename/techreport.pdf
 */
export
class Store implements IMessageHandler, IIterable<Table> {
  /**
   * A signal emitted when changes are made to the store.
   *
   * #### Notes
   * This signal is emitted either at the end of a local mutation,
   * or after a remote mutation has been applied.
   *
   * The payload represents the set of local changes that were made
   * to bring the store to its current state.
   *
   * #### Complexity
   * `O(1)`
   */
  get changed(): ISignal<Store, Store.IChangedArgs> {
    throw'';
  }

  /**
   * The unique id of the store.
   *
   * #### Notes
   * The id is unique among all other collaborating peers.
   *
   * #### Complexity
   * `O(1)`
   */
  get id(): number {
    return 0;
  }

  get version(): number {
    return 0;
  }

  iter(): IIterator<Table> {
    throw '';
  }

  processMessage(msg: Message): void {

  }

  /**
   * Make changes to the the store.
   *
   * @param message - The message to associate with the patch.
   *   This should be a simple human readable description.
   *
   * @param fn - The function that will edit the store. The unique
   *   patch id is provided as the first argument. All changes made
   *   by the function are associated with the given patch id.
   *
   * @throws An exception if `mutate` is called recursively.
   *
   * #### Notes
   * Except for `undo` and `redo`, the store can only be modified
   * during a `mutate` operation.
   *
   * The provided mutation function is invoked synchronously.
   *
   * If changes are made, the `changed` signal will be emitted before
   * this method returns.
   */
  mutate(message: string, fn: (patchId: string) => void): void {

  }

  /**
   * Undo a patch that was previously applied.
   *
   * @param patchId - The patch(es) to undo.
   *
   * @returns A promise which resolves when the action is complete.
   *
   * @throws An exception if `undo` is called during a mutation.
   *
   * #### Notes
   * If changes are made, the `changed` signal will be emitted before
   * the promise resolves.
   */
  undo(patchId: string | string[]): Promise<void> {

  }

  /**
   * Redo a patch that was previously undone.
   *
   * @param patchId - The patch(es) to redo.
   *
   * @returns A promise which resolves when the action is complete.
   *
   * @throws An exception if `redo` is called during a mutation.
   *
   * #### Notes
   * If changes are made, the `changed` signal will be emitted before
   * the promise resolves.
   */
  redo(patchId: string | string[]): Promise<void> {

  }

  /**
   * Get the table for a particular schema.
   *
   * @param schema - The schema of interest.
   *
   * @returns The table for the specified schema.
   *
   * @throws An exception if no table exists for the given schema.
   *
   * #### Complexity
   * `O(log32 n)`
   */
  getTable<S extends Schema>(schema: S): ITable<S> {

  }

  /**
   * @internal
   */
  mutationGuard(): void {

  }

  /**
   * @internal
   */
  processRecordCreation(table: Table, id: string): void {

  }

  /**
   * @internal
   */
  processRegisterMutation(record: Record, name: string, previous: ReadonlyJSONValue, current: ReadonlyJSONValue): void {

  }

  /**
   * @internal
   */
  processListMutation(list: List, removed: null, inserted: null, ordered: null): void {

  }

  /**
   * @internal
   */
  processMapMutation(map: Map, previous: null, current: null): void {

  }

  /**
   * @internal
   */
  processTextMutation(text: Text): void {

  }

  /**
   * @internal
   */
  withRecordCreation(table: Table, cb: Store.RecordCreationCallback): void {

  }

  /**
   * @internal
   */
  withRegisterMutation(record: Record, cn: Store.RegisterMutationCallback): void {

  }

  /**
   * @internal
   */
  withListMutation(list: List, cb: Store.ListMutationCallback): void {

  }

  /**
   * @internal
   */
  withMapMutation(map: Map, cb: Store.MapMutationCallback): void {

  }

  /**
   * @internal
   */
  withTextMutation(map: Text, cb: Store.TextMutationCallback): void {

  }
}


/**
 * The namespace for the `Store` class statics.
 */
export
namespace Store {
  /**
   * The arguments object for the store `changed` signal.
   */
  export
  interface IChangedArgs {
    /**
     * Whether the change was generated by mutation, undo, or redo.
     */
    readonly type: 'mutate' | 'undo' | 'redo';

    /**
     * The id of the patch associated with the change.
     */
    readonly patchId: string;

    /**
     * The id of the store responsible for the change.
     */
    readonly storeId: number;

    /**
     * A mapping of schema id to table change set.
     */
    readonly changes: ChangeSet;
  }

  /**
   * A type alias for a store change set.
   */
  export
  type ChangeSet = {
    readonly [schemaId: string]: Table.ChangeSet<Schema>;
  };

  /**
   * @internal
   */
  export
  type RecordCreationCallback = () => void;

  /**
   * @internal
   */
  export
  type RegisterMutationCallback = () => void;

  /**
   * @internal
   */
  export
  type ListMutationCallback = () => void;

  /**
   * @internal
   */
  export
  type MapMutationValues = { [key: string]: ReadonlyJSONValue | undefined };

  /**
   * @internal
   *
   */
  export
  type MapMutationCallback = (previous: MapMutationValues, current:  MapMutationValues) => void;

  /**
   * @internal
   */
  export
  type TextMutationCallback = () => void;
}


/**
 *
 */
export
function createStore(schemas: ReadonlyArray<Schema>): Promise<Store> {
  throw '';
}
