import React, { useEffect } from "react";
import axios from 'axios'
//include images into your bundle
import rigoImage from "../../img/rigo-baby.jpg";

//create your first component
const Home = () => {
	const [tasks, setTasks] = React.useState([])
	const [userInput, setUserInput] = React.useState("")
	const [editMode, setEditMode] =React.useState(null)
	const[editInput, setEditInput] = React.useState("")

	useEffect(() => {
		getUser()
	}, [])

	const getUser = () => {
		axios.get("https://playground.4geeks.com/todo/users/jpalma13")
			.then((response) => {
				console.log(response)
				setTasks(response.data.todos)
			}).catch(error => {
				axios.post("https://playground.4geeks.com/todo/users/jpalma13").then(postResponse => postResponse.data)
					.then(postData => { })
			})
	}

	const newTask = () => {
		if (userInput === "") {
			return alert("You must type something in! (e.g. Eat BreakFast)")
		}
		let newTask = { label: userInput, isDone: false }
		axios.post("https://playground.4geeks.com/todo/todos/jpalma13", newTask).then(postResponse => postResponse.data)
			.then(postData => {
				setUserInput("")
				getUser()
			});

	}

	const enterKey = (event) => {
		if (event.key === 'Enter') {
				newTask()
				event.preventDefault()
			}
		}

			
const deleteTask = (id) => {
    			axios.delete("https://playground.4geeks.com/todo/todos/" + id)
        			.then(deleteResponse => deleteResponse.data)
       				 .then(deleteData => {
						getUser()
        });
	}
	
const putRequest = (id, updatedTask) => {
    axios.put("https://playground.4geeks.com/todo/todos/" + id, updatedTask)
        .then(putResponse => putResponse.data)
        .then(putData => {
            getUser() 
            console.log(putData)
        });
}
	const toggleCheckmark = (index) => {
		let updatedTask = tasks.filter((task, index) => {
			if (index === i) {
				return { ...task, isDone: !task.isDone }
			} else {
				return task
			}
		})
		setTasks(updatedTask)
	}

const editTask=(index)=>{
	setEditMode(index)
	setEditInput(tasks[index].label)
}
const cancelEdit=()=>{
	setEditMode(null)
	setEditInput("")
}
const saveEdit=(index)=>{
	if(editInput ===""){
		return(alert("You must type something in!"))
	}const task=tasks[index]
		let updatedTask = { ...task, label: editInput }
		putRequest(task.id, updatedTask)
		setEditMode(null)
		setEditInput("")

}
const editKeyDown=(event, index)=>{
	if (event.key === 'Enter') {
			saveEdit(index)
		event.preventDefault()
}else if (event.key === 'Escape') {
			cancelEdit()
		}
	}
	return (
		<div className="container">
			<h3>TO-DO List</h3>
			<div className="input-container">
				<input className="text-input" type="text" placeholder="Enter task here ..."
					onChange={(e) => setUserInput(e.target.value)}
					value={userInput}
					onKeyDown={enterKey} />
				<button className="add" onClick={newTask}>Add Task</button>
			</div>
			<div>
				<ul className="lists">
					{tasks?.map((task, index) =>
						<li key={index}>
							<input className="checked" type="checkbox" onChange={() => toggleCheckmark(index)} checked={task.isDone} />
							{editMode === index ?(
								<>
									<input type="text" value={editInput} onChange={(e) => setEditInput(e.target.value)} onKeyDown={(event)=>editKeyDown(event, index)} />
									<button className="cancel" onClick={()=>cancelEdit()}>❌</button>
									<button className="save" onClick={()=>saveEdit(index)}>✔</button>
								</>
							):(
								<>
									<label>{task.label}</label>
									<button className="edit" onClick={()=>editTask(index)}>✎</button>
									<button className="remove" onClick={() => deleteTask(task.id)}>🗑️</button>
								</>
							)}
						</li>
					)}
				</ul>
			</div>
		</div>

	);
};

export default Home;