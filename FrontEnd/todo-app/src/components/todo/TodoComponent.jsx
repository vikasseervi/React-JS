import { useNavigate, useParams } from "react-router-dom"
import { createTodoApi, retrieveTodoApi, updateTodoApi } from "./api/TodoApiService";
import { useAuth } from "./security/AuthContext";
import { useEffect, useState } from "react";
import { ErrorMessage, Field, Form, Formik } from 'formik'
import moment from 'moment'

export default function TodoComponent(){

    const {id} = useParams()
    const navigate = useNavigate()
    const authContext = useAuth()
    const username = authContext.username
    const [description, setDescription] = useState('')
    const [targetDate, setTargetDate] = useState('')
    useEffect( () => retrieveTodos(), [id])


    function retrieveTodos(){
        if(id !== -1){
            retrieveTodoApi(username, id)
            .then(response => {
                setDescription(response.data.description)
                setTargetDate(response.data.targetDate)
            })
            .catch(error => console.log(error))
        }
    }

    function validate(values){
        let errors = {
            
        }
        console.log('Target Date:', values.targetDate);
        console.log('Is Valid:', moment(values.targetDate).isValid());
        if(values.description.length < 5){
            errors.description = "Enter atleast 5 characters"
        }
        if(!values.targetDate || !moment(values.targetDate).isValid()){
            errors.targetDate = "Enter a target"
        }
        return errors
    }

    function onSubmit(values){
        const todo = {
            id: id,
            username: username,
            description: values.description,
            targetDate: values.targetDate,
            done: false,
        }
        if(id === -1){
            createTodoApi(username, todo)
            .then(response => {
                navigate('/todos')
            })
            .catch(error => console.log(error))
        }
        else {
            updateTodoApi(username, id, todo)
            .then(response => {
                navigate('/todos')
            })
            .catch(error => console.log(error))
        }
    }

    return(
        <div className="container">
            <h1>Enter todo Details </h1>
            <div>
                <Formik initialValues={ {description, targetDate} }
                    enableReinitialize = {true}
                    onSubmit = {onSubmit}
                    validate = {validate}
                    validateOnBlur = {false}
                    validateOnChange = {false}>
                    {
                        (props) => (
                            <Form>
                                <ErrorMessage name="description" component="div" className="alert alert-warning"/>
                                <ErrorMessage name="targetDate" component="div" className="alert alert-warning"/>
                                <fieldset className="form-group">
                                    <label>Description</label>
                                    <Field type="text" className="form-control" name="description"/>
                                </fieldset>
                                <fieldset className="form-group">
                                    <label>Target Date</label>
                                    <Field type="date" className="form-control" name="targetDate"/>
                                </fieldset>
                                <div>
                                    <button type="submit" className="btn btn-success m-5"> Save </button>
                                </div>
                            </Form>
                        )
                    }
                </Formik>
            </div>
        </div>
    )
}