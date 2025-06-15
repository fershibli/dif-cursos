import { Request, Response } from "express"
import { validationResult } from "express-validator"
import { ObjectId } from "mongodb"
import { getDatabaseConnection } from "../db"

export async function listarTodos(req: Request, res: Response) {
    try {
        const db = await getDatabaseConnection()
        const cursos = await db.collection("cursos").find({}).toArray()
        res.json(cursos)
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar cursos", error })
    }
}

export async function buscarPorId(req: Request, res: Response) {
    try {
        const db = await getDatabaseConnection()
        const curso = await db.collection("cursos").findOne({
            _id: new ObjectId(req.params.id),
        })
        curso
            ? res.json(curso)
            : res.status(404).json({ message: "Curso não encontrado" })
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar curso", error })
    }
}

export async function buscarRapida(req: Request, res: Response) {
    try {
        const db = await getDatabaseConnection()
        const termoBusca = (req.query.busca as string) || ""

        const cursos = await db
            .collection("cursos")
            .find({
                $or: [
                    { titulo: { $regex: termoBusca, $options: "i" } },
                    { instrutor: { $regex: termoBusca, $options: "i" } },
                    { categoria: { $regex: termoBusca, $options: "i" } },
                ],
            })
            .toArray()

        res.json(cursos)
    } catch (error) {
        res.status(500).json({ message: "Erro na busca rápida", error })
    }
}

export async function buscarAvancada(req: Request, res: Response) {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() })

        const db = await getDatabaseConnection()
        const query: any = {}

        if (req.query["minPreco"] || req.query["maxPreco"]) {
            query.preco = {}
            if (req.query["minPreco"])
                query.preco.$gte = parseFloat(req.query["minPreco"] as string)
            if (req.query["maxPreco"])
                query.preco.$lte = parseFloat(req.query["maxPreco"] as string)
        }

        const categoriaConditions = []

        if (req.query["categoria"]) {
            const categoriasIncluidas = (req.query["categoria"] as string)
                .split(",")
                .map((cat) => cat.trim())
            categoriaConditions.push({
                categoria: { $in: categoriasIncluidas },
            })
        }

        if (req.query["excluirCategorias"]) {
            const categoriasExcluidas = (
                req.query["excluirCategorias"] as string
            )
                .split(",")
                .map((cat) => cat.trim())
            categoriaConditions.push({
                categoria: { $nin: categoriasExcluidas },
            })
        }

        if (categoriaConditions.length > 0) {
            query.$and = query.$and || []
            query.$and.push(...categoriaConditions)
        }

        const cursos = await db.collection("cursos").find(query).toArray()
        res.json(cursos)
    } catch (error) {
        res.status(500).json({ message: "Erro na busca avançada", error })
    }
}

export async function criar(req: Request, res: Response) {
    try {
        const db = await getDatabaseConnection()
        const resultado = await db.collection("cursos").insertOne(req.body)
        res.status(201).json({ id: resultado.insertedId })
    } catch (error) {
        res.status(500).json({ message: "Erro ao criar curso", error })
    }
}

export async function atualizar(req: Request, res: Response) {
    try {
        const db = await getDatabaseConnection()
        const resultado = await db
            .collection("cursos")
            .updateOne({ _id: new ObjectId(req.params.id) }, { $set: req.body })
        resultado.matchedCount
            ? res.json({ message: "Curso atualizado com sucesso" })
            : res.status(404).json({ message: "Curso não encontrado" })
    } catch (error) {
        res.status(500).json({ message: "Erro ao atualizar curso", error })
    }
}

export async function excluir(req: Request, res: Response) {
    try {
        const db = await getDatabaseConnection()
        const resultado = await db.collection("cursos").deleteOne({
            _id: new ObjectId(req.params.id),
        })
        resultado.deletedCount
            ? res.json({ message: "Curso excluído com sucesso" })
            : res.status(404).json({ message: "Curso não encontrado" })
    } catch (error) {
        res.status(500).json({ message: "Erro ao excluir curso", error })
    }
}
