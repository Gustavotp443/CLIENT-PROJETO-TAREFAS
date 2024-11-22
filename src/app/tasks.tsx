"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ITasks,
  tasksService,
  TaskStatus,
} from "./shared/services/api/tasks/tasksService";
import Pagination from "./shared/components/pagination";

const Tasks = () => {
  const [tasks, setTasks] = useState<ITasks[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [filter, setFilter] = useState<string>("");
  const [selectedTask, setSelectedTask] = useState<ITasks | null>(null);
  const [newTask, setNewTask] = useState<string>("");

  const inputRef = useRef<HTMLInputElement>(null);

  // Função para buscar tarefas
  const fetchTasks = useCallback(async () => {
    const response = await tasksService.getAll(page, filter);

    if (response instanceof Error) {
      console.error(response);
      return;
    }
    setTasks(response.data);
    setTotalCount(response.totalCount);
  }, [page, filter]);

  // Função para criar nova tarefa
  const handleCreateTask = async () => {
    if (newTask.trim() === "") return;

    const taskData = { title: newTask, completed: TaskStatus.PENDING };
    const response = await tasksService.create(taskData);
    if (response instanceof Error) {
      console.error(response);
    } else {
      setNewTask("");
      fetchTasks();
    }
  };

  // Função para atualizar tarefa existente
  const handleUpdateTask = async (task: ITasks) => {
    if (!selectedTask || newTask.trim() === "") return;

    const updatedTask = { ...task, title: newTask };
    const response = await tasksService.updateById(task.id, updatedTask);
    if (response instanceof Error) {
      console.error(response);
    } else {
      setNewTask("");
      setSelectedTask(null);
      fetchTasks();
    }
  };

  // Excluir tarefa
  const handleDeleteTask = async (id: number) => {
    const response = await tasksService.deleteById(id);
    if (response instanceof Error) {
      console.error(response);
    } else {
      fetchTasks();
    }
  };

  // Concluir tarefa
  const handleCompleteTask = async (task: ITasks) => {
    const updatedTask = { ...task, completed: TaskStatus.COMPLETED };
    const response = await tasksService.updateById(task.id, updatedTask);
    if (response instanceof Error) {
      console.error(response);
    } else {
      fetchTasks();
    }
  };

  // Lidar com o envio do formulário
  const handleFormSubmit = async () => {
    if (selectedTask) {
      await handleUpdateTask(selectedTask);
    } else {
      await handleCreateTask();
    }
  };

  // Limpar seleção ao clicar fora dos cards e input
  const handleOutsideClick = (e: React.MouseEvent) => {
    if (
      (e.target as HTMLElement).closest(".task-card") || // Ignora cliques nos cards
      (e.target as HTMLElement) === inputRef.current // Ignora cliques no input
    )
      return;
    setSelectedTask(null);
    setNewTask("");
  };

  // Limpar seleção ao pressionar ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedTask(null);
        setNewTask("");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Função para alterar a página
  const changePage = (newPage: number) => {
    setPage(newPage);
  };

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <div
      className="container mx-auto p-4"
      onClick={handleOutsideClick} // Adiciona evento de clique ao container
    >
      {/* Filtro */}
      <div className="mb-4 flex items-center gap-4">
        <input
          type="text"
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setPage(1);
          }}
          className="flex-1 px-4 py-2 border rounded"
          placeholder="Filtrar tarefas por título"
        />
        <button
          onClick={() => {
            setPage(1);
            fetchTasks();
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Filtrar
        </button>
      </div>

      {/* Formulário de criação/edição */}
      <div className="mb-6 flex items-center gap-4">
        <input
          ref={inputRef} // Referência para o input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="flex-1 px-4 py-2 border rounded"
          placeholder="Digite o título da tarefa"
        />
        <button
          onClick={handleFormSubmit}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          {selectedTask ? "Atualizar" : "+"}
        </button>
      </div>

      {/* Lista de tarefas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`task-card p-4 border rounded shadow-md flex flex-col justify-between cursor-pointer 
              ${selectedTask?.id === task.id ? "bg-slate-700" : "bg-slate-800"} 
              hover:bg-slate-700`}
            onClick={() => {
              setSelectedTask(task);
              setNewTask(task.title);
            }}
          >
            <div>
              <h3 className="text-lg font-bold truncate text-green-500">
                {task.title}
              </h3>
              <p className="text-sm text-gray-600">
                Criado em: {new Date(task.createdAt).toLocaleString()}
              </p>
              <p
                className={`text-sm mt-2 ${
                  task.completed === TaskStatus.PENDING
                    ? "text-yellow-500"
                    : "text-green-500"
                }`}
              >
                {task.completed === TaskStatus.PENDING
                  ? "Pendente"
                  : "Concluída"}
              </p>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <button
                onClick={() => handleCompleteTask(task)}
                className="px-4 py-2 bg-green-500 text-white rounded"
                disabled={task.completed === TaskStatus.COMPLETED}
              >
                Concluir
              </button>
              <button
                onClick={() => handleDeleteTask(task.id)}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Deletar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Controles de paginação */}
      <Pagination
        currentPage={page}
        totalCount={totalCount}
        onPageChange={changePage}
      />
    </div>
  );
};

export default Tasks;
