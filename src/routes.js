import { randomUUID } from "crypto";
import { Database } from "./database";
import { buildRoutePath } from "./utils/build-router-path";

const database = new Database();

export const routes = [
  {
    method: "POST",
    path: buildRoutePath("/tasks"),
    handler: (request, response) => {
      const { title, description } = request.body;

      if (!title || !description) {
        return response
          .writeHead(400)
          .end(
            JSON.stringify({ message: "Title/description field is required" })
          );
      }

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      };

      database.insert("tasks", task);

      return response.writeHead(201).end();
    },
  },
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handler: (request, response) => {
      const { search } = request.query;

      const tasks = database.select(
        "tasks",
        search
          ? {
              title: search,
              description: search,
            }
          : null
      );

      return response.writeHead(200).end(tasks);
    },
  },
  {
    method: "PUT",
    path: buildRoutePath("/tasks/:id"),
    handler: (request, response) => {
      const { id } = request.params;
      const { title, description } = request.body;

      const task = database.select("tasks", { id });

      if (!task) {
        return response
          .writeHead(404)
          .end(JSON.stringify({ message: "Task does not exists" }));
      }

      if (title) {
        task.title = title;
      }

      if (description) {
        task.description = description;
      }

      database.update("tasks", task);

      return response.writeHead(204).end();
    },
  },
  {
    method: "PATCH",
    path: buildRoutePath("/tasks/:id/complete"),
    handler: (request, response) => {
      const { id } = request.params;
      const { completed } = request.body;

      const task = database.select("tasks", { id });

      if (!task) {
        return response
          .writeHead(404)
          .end(JSON.stringify({ message: "Task does not exists" }));
      }

      task.completed_at = completed;

      database.update("tasks", task);

      return response.writeHead(204).end();
    },
  },
  {
    method: "DELETE",
    path: buildRoutePath("/tasks/:id"),
    handler: (request, response) => {
      const { id } = request.params;

      const task = database.select("tasks", { id });

      if (!task) {
        return response
          .writeHead(404)
          .end(JSON.stringify({ message: "Task does not exists" }));
      }

      database.delete("tasks", id);

      return response.writeHead(204).end();
    },
  },
];
