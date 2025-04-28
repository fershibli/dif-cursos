import { ObjectId } from "mongodb";

export interface Course {
    _id?: ObjectId;
    titulo: string;
    instrutor: string;
    categoria: string;
    duracao_horas: number;
    alunos_matriculados: number;
    data_lancamento: Date;
    preco: number;
    avaliacao?: number;
    modulos: string[];
    createdAt?: Date;
    updatedAt?: Date;
  }