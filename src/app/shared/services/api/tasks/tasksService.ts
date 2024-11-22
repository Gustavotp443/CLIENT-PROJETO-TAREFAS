import { enviromnent } from "@/app/enviroment/enviroment";
import { api } from "../axios-config";

export enum TaskStatus {
    PENDING = "PENDING",
    COMPLETED = "COMPLETED"
}
  
export interface ITasks {
    id: number;
    title: string;
    completed: TaskStatus;
    createdAt: Date;
}

export interface ICreateTasks{
    title: string;
    completed: TaskStatus;
}

export interface IUpdateTasks{
    title?: string;
    completed?: TaskStatus;
}

type TTasksWithTotalCount = {
    data: ITasks[];
    totalCount: number;
  };

const create = async (dados: ICreateTasks): Promise<number | Error> => {
    console.log(dados)
    try {
      const { data } = await api.post<ITasks>(`/tasks`, dados);
  
      if (data) {
        return data.id;
      }
  
      return new Error("Erro ao criar o registro.");
    } catch (error) {
      console.error(error);
      return new Error(
        (error as { message: string }).message || "Erro ao criar o registro."
      );
    }
};

const deleteById = async (id: number): Promise<void | Error> => {
    try {
      await api.delete(`/tasks/${id}`);
    } catch (error) {
      console.error(error);
      return new Error(
        (error as { message: string }).message || "Erro ao apagar o registro."
      );
    }
};

const getAll = async (
    page = 1,
    filter = "",
  ): Promise<TTasksWithTotalCount | Error> => {
    try {
      const urlRelativa = `/tasks?page=${page}&limit=${enviromnent.lineLimits}&filter=${filter}`;
      const { data, headers } = await api.get(urlRelativa);
      if (data) {
        return {
          data,
          totalCount: Number(headers["x-total-count"] || enviromnent.lineLimits)
        };
      }
  
      return new Error("Erro ao lista os registros.");
    } catch (error) {
      console.error(error);
      return new Error(
        (error as { message: string }).message || "Erro ao lista os registros."
      );
    }
};


const updateById = async (
    id: number,
    dados: IUpdateTasks
  ): Promise<void | Error> => {
    try {
      await api.put(`/tasks/${id}`, dados);
    } catch (error) {
      console.error(error);
      return new Error(
        (error as { message: string }).message || "Erro ao atualizar o registro."
      );
    }
  };



export const tasksService = {
    create,
    deleteById,
    getAll,
    updateById
};
