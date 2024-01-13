import {Dispatch, SetStateAction} from "react";
import {OkPacket, ProcedureCallPacket, ResultSetHeader, RowDataPacket} from "mysql2";

export type StateTuple<S> = [S, Dispatch<SetStateAction<S>>];

// mysql2 kinda bad and they deprecated OkPacket except they are still using it in the query result.
// who tf makes 10 different types of packets for a result, it would be or either you throw or you have an iterable result.
export type Packets =  OkPacket | RowDataPacket[] | ResultSetHeader[] | RowDataPacket[][] | OkPacket[] | ProcedureCallPacket;