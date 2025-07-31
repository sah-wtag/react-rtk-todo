import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const todosApi = createApi({
  reducerPath: "todosApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/" }),
  tagTypes: ["Todos"],
  endpoints: (builder) => ({
    getTodos: builder.query({
      async queryFn(
        { page = 1, search = "" },
        _queryApi,
        _extraOptions,
        fetchWithBQ
      ) {
        try {
          // Fetch all todos
          const result = await fetchWithBQ(`todos`);

          if (result.error) return { error: result.error };

          // Manual search filtering
          let allTodos = result.data;
          if (search.trim()) {
            const searchLower = search.toLowerCase().trim();
            allTodos = allTodos.filter((todo) =>
              todo.title.toLowerCase().includes(searchLower)
            );
          }
          const totalCount = allTodos.length;
          const limit = 5;
          const totalPages = Math.ceil(totalCount / limit);

          // Manual pagination
          const startIndex = (page - 1) * limit;
          const endIndex = startIndex + limit;
          const paginatedTodos = allTodos.slice(startIndex, endIndex);

          return {
            data: {
              todos: paginatedTodos,
              totalCount: totalCount,
              currentPage: page,
              limit: limit,
              totalPages: totalPages,
            },
          };
        } catch (error) {
          return { error: { status: "CUSTOM_ERROR", error: error.toString() } };
        }
      },
      providesTags: ["Todos"],
    }),
    // Get all todos (for ID calculation)
    getAllTodos: builder.query({
      query: () => "todos",
      providesTags: ["Todos"],
    }),
    addTodo: builder.mutation({
      query: (todo) => ({
        url: "todos",
        method: "POST",
        body: todo,
      }),
      invalidatesTags: ["Todos"],
    }),
    updateTodo: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `todos/${id}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: ["Todos"],
    }),
    deleteTodo: builder.mutation({
      query: (id) => ({
        url: `todos/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Todos"],
    }),
  }),
});

export const {
  useGetTodosQuery,
  useGetAllTodosQuery,
  useAddTodoMutation,
  useUpdateTodoMutation,
  useDeleteTodoMutation,
} = todosApi;
