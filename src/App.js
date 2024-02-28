import 'bootstrap/dist/css/bootstrap.css';
import axios from "axios";
import {useEffect, useState} from "react";

const App = () => {
    // Backend API URL
    const baseUrl = 'http://localhost:5000/todos';

    const [todos, setTodos]             = useState([]);
    const [title, setTitle]             = useState('');
    const [description, setDescription] = useState('');
    const [todoId, setTodoId]           = useState(null);
    const [isEdit, setIsEdit]           = useState(false);
    const [successMsg, setSuccessMsg]   = useState(null);
    const [errorMsg, setErrorMsg]       = useState(null);

    // Fetch all todos
    const getTodos = async () => {
        try {
            // Fetch data from backend
            const response = await axios.get(`${baseUrl}`);

            // Set todos data to todos state
            setTodos(response.data.data);

            // Show success message
            setSuccessMsg(response.data.message);
        } catch (error) {
            console.log(error.response);

            // Show error message
            setErrorMsg(error.response.data.message);
        } finally {
            // Hide success/error message after 5 seconds
            hideMsg();
        }
    };

    // Add new todo
    const addTodoHandler = async (e) => {
        // Prevent default form submission
        e.preventDefault();
        try {
            // Send post request to backend by sending title and description
            const response = await axios.post(`${baseUrl}`, {title, description});

            // Add new todo and update todos state
            setTodos([...todos, response.data.data]);

            // Reset todo form
            setTitle('');
            setDescription('');

            // Show success message
            setSuccessMsg(response.data.message);
        } catch (error) {
            console.log(error.response);
            // Show error message
            setErrorMsg(error.response.data.message);
        } finally {
            // Hide success/error message after 5 seconds
            hideMsg();
        }
    };

    // Cancel/Reset todo form
    const cancelTodoHandler = () => {
        setTitle('');
        setDescription('');
        setIsEdit(false);
    };

    // Edit todo
    const editTodoHandler = async (todo) => {
        // Set todo data to todo form
        setTitle(todo.title);
        setDescription(todo.description);
        setTodoId(todo.id);
        setIsEdit(true);
    };

    // Update todo
    const updateTodoHandler = async (e) => {
        // Prevent default form submission
        e.preventDefault();
        try {
            // Send put request to backend by sending title and description
            const response     = await axios.put(`${baseUrl}/${todoId}`, {title, description});

            // Update todo in todos state
            const updatedTodos = todos.map(todo => {
                if (todo.id === todoId) {
                    todo.title       = title;
                    todo.description = description;
                }
                return todo;
            });

            // Update todos state
            setTodos(updatedTodos);

            // Reset todo form
            setTitle('');
            setDescription('');
            setTodoId(null);
            setIsEdit(false);

            // Show success message
            setSuccessMsg(response.data.message);
        } catch (error) {
            console.log(error.response);
            // Show error message
            setErrorMsg(error.response.data.message);
        } finally {
            // Hide success/error message after 5 seconds
            hideMsg();
        }
    };

    // Delete todo
    const deleteTodoHandler = async (id) => {
        try {
            // Send delete request to backend
            const response      = await axios.delete(`${baseUrl}/${id}`);

            // Remove todo from todos state
            const filteredTodos = todos.filter(todo => todo.id !== id);

            // Update todos state
            setTodos(filteredTodos);

            // Show success message
            setSuccessMsg(response.data.message);
        } catch (error) {
            console.log(error.response);
            // Show error message
            setErrorMsg(error.response.data.message);
        } finally {
            // Hide success/error message after 5 seconds
            hideMsg();
        }
    };

    // Submit handler
    const submitHandler = async (e) => {
        // Conditionally call addTodoHandler or updateTodoHandler
        if (isEdit) {
            await updateTodoHandler(e);
        } else {
            await addTodoHandler(e);
        }
    };

    // Hide success/error message after 5 seconds
    const hideMsg = () => {
        setTimeout(() => {
            setSuccessMsg(null);
            setErrorMsg(null);
        }, 5000);
    };


    // Fetch all todos on page load or component mounted
    useEffect(() => {
        getTodos();
    }, []);

    return (
        <div className="container">
            <h1 className="h1 text-center">Todo APP</h1>
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card mb-4">
                        <div className="card-header">
                            <h4 className="card-title">
                                Add Todo
                            </h4>
                        </div>
                        <form onSubmit={submitHandler}>
                            <div className="card-body">
                                <div className="form-group mb-3">
                                    <label htmlFor="title" className="form-label">Title</label>
                                    <input type="text" id="title" name="title" className="form-control"
                                           placeholder="Enter title" required autoFocus value={title}
                                           onChange={e => setTitle(e.target.value)}/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="description" className="form-label">Description</label>
                                    <textarea className="form-control" name="description"
                                              id="description" cols="30" rows="10"
                                              placeholder="Enter description" required value={description}
                                              onChange={e => setDescription(e.target.value)}></textarea>
                                </div>
                            </div>
                            <div className="card-footer">
                                <p className="text-end">
                                    <button type="button" className="btn btn-danger btn-lg" onClick={cancelTodoHandler}>
                                        Cancel
                                    </button>
                                    {isEdit ?
                                        <button type="submit" className="btn btn-primary btn-lg ms-2">
                                            Update
                                        </button> :
                                        <button type="submit" className="btn btn-primary btn-lg ms-2">
                                            Save
                                        </button>}
                                </p>
                            </div>
                        </form>
                    </div>

                    {successMsg &&
                        <div className="alert alert-success" role="alert">
                            {successMsg}
                        </div>
                    }

                    {errorMsg &&
                        <div className="alert alert-danger" role="alert">
                            {errorMsg}
                        </div>
                    }
                </div>
            </div>

            <div className="row mt-5 mb-5">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-header">
                            <h4 className="card-title">
                                Todo List
                            </h4>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-bordered table-hover table-striped">
                                    <thead>
                                    <tr>
                                        <th className="text-center">SL#</th>
                                        <th>Title</th>
                                        <th>Description</th>
                                        <th className="text-center">Action</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {todos.map((todo, index) => (
                                        <tr key={index}>
                                            <td className="text-center">{index + 1}</td>
                                            <td>{todo.title}</td>
                                            <td>
                                                {todo.description.length > 50 ? todo.description.substring(0, 50) + '...' : todo.description}
                                            </td>
                                            <td className="text-center">
                                                <button type="button" className="btn btn-sm btn-primary btn-sm"
                                                        onClick={editTodoHandler.bind(this, todo)}>
                                                    Edit
                                                </button>
                                                <button type="button" className="btn btn-sm btn-danger btn-sm ms-2"
                                                        onClick={deleteTodoHandler.bind(this, todo.id)}>
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
