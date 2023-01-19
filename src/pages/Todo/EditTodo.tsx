import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";
import { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router";
import { TodoItem, TodoPriorityEnum, useTodo } from "../../hooks/useTodo";

interface EditTodoInterface extends RouteComponentProps<{todoId: string}> {}

const EditTodo: React.FC<EditTodoInterface> = ({ match }) => {
  const { todos, updateTodo } = useTodo();
  const [selectedTodo, setSelectedTodo] = useState<TodoItem>();
  const [priority, setPriority] = useState<TodoPriorityEnum>(TodoPriorityEnum.normal);
  const [task, setTask] = useState<string | null | undefined>("");
  const router = useIonRouter()

  async function handleUpdateTodo() {
    if (selectedTodo) {
      if (!task) {
        alert({
          header: 'Failed',
          message: 'Task cannot be empty',
          backdropDismiss: false,
          buttons: ['OK']
        })
  
        return;
      }
  
      await updateTodo({
        id: selectedTodo.id,
        priority: priority,
        task: task,
        complete: selectedTodo.complete
      })

      router.push('/')
    }
  }

  useEffect(() => {
    const todo = todos.find((todo) => todo.id.toString() === match.params.todoId)
    if (todo) {
      setSelectedTodo(todo)
      setTask(todo.task)
      setPriority(todo.priority)
    }
  }, [match.params.todoId, todos])

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonTitle>
            Edit Todo
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonList className="ion-margin-bottom">
          <IonItem>
            <IonLabel position="fixed">Task</IonLabel>
            <IonTextarea
              autoGrow={true}
              placeholder="Add task here"
              required={true}
              value={task}
              onIonChange={(e) => setTask(e.target.value)}
            ></IonTextarea>
          </IonItem>
          <IonItem>
            <IonLabel position="fixed">Priority</IonLabel>
            <IonSelect
              placeholder="Priority"
              value={priority}
              onIonChange={(e) => setPriority(e.target.value)}
            >
              <IonSelectOption value={TodoPriorityEnum.normal}>Normal</IonSelectOption>
              <IonSelectOption value={TodoPriorityEnum.high}>High</IonSelectOption>
              <IonSelectOption value={TodoPriorityEnum.urgent}>Urgent</IonSelectOption>
            </IonSelect>
          </IonItem>
        </IonList>
        <div className="ion-margin-vertical">
          <IonButton expand="block" onClick={handleUpdateTodo} disabled={!task}>Update</IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default EditTodo;
