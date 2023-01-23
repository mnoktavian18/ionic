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
  useIonAlert,
  useIonLoading,
  useIonRouter,
  useIonViewWillEnter,
} from "@ionic/react";
import { useRef, useState } from "react";
import { RouteComponentProps } from "react-router";
import { TodoItem, TodoPriorityEnum, getTodo, updateTodo } from "./todo";

interface EditTodoInterface extends RouteComponentProps<{todoId: string}> {}

const EditTodo: React.FC<EditTodoInterface> = ({ match }) => {
  const [selectedTodo, setSelectedTodo] = useState<TodoItem>();
  const task = useRef<HTMLIonTextareaElement>(null);
  const priority = useRef<HTMLIonSelectElement>(null);
  const [alert] = useIonAlert();
  const [loading] = useIonLoading();
  const router = useIonRouter()

  async function handleUpdateTodo() {
    const inputTask = task.current?.value;
    const inputPriority = priority.current?.value;

    loading({
      message: 'Loading',
      duration: 500,
      spinner: 'bubbles'
    })

    if (selectedTodo) {
      if (!inputTask || !inputPriority) {
        await alert({
          header: 'Failed',
          message: 'Task or priority cannot be empty',
          backdropDismiss: false,
          buttons: ['OK']
        })
  
        return;
      }
  
      await updateTodo({
        id: selectedTodo.id,
        priority: inputPriority,
        task: inputTask,
        complete: selectedTodo.complete
      })

      setTimeout(() => {
        router.push('/')
      }, 500)
    }
  }

  useIonViewWillEnter(() => {
    const init = async () => {
      const todos = await getTodo()
      const todo = todos.find((todo) => todo.id.toString() === match.params.todoId)
      if (todo) {
        setSelectedTodo(todo)
        if (task.current && priority.current) {
          task.current.value = todo.task
          priority.current.value = todo.priority
        }
      }
    }

    init()
  }, [match.params.todoId])

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
        <form onSubmit={handleUpdateTodo}>
          <IonList className="ion-margin-bottom">
            <IonItem>
              <IonLabel position="fixed">Task</IonLabel>
              <IonTextarea
                autoGrow={true}
                placeholder="Add task here"
                required={true}
                ref={task}
              ></IonTextarea>
            </IonItem>
            <IonItem>
              <IonLabel position="fixed">Priority</IonLabel>
              <IonSelect
                placeholder="Priority"
                ref={priority}
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
        </form>
      </IonContent>
    </IonPage>
  );
};

export default EditTodo;
