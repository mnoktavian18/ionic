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
  useIonViewWillEnter,
} from "@ionic/react";
import { useRef } from "react";
import { useHistory } from "react-router";
import { TodoPriorityEnum, addTodo } from "./todo";

const CreateTodo: React.FC = () => {
  const task = useRef<HTMLIonTextareaElement>(null)
  const priority = useRef<HTMLIonSelectElement>(null)
  const [alert] = useIonAlert();
  const [loading] = useIonLoading();
  const router = useHistory()

  async function handleAddTodo() {
    const inputTask = task.current?.value;
    const inputPriority = priority.current?.value;

    if (!inputTask || !inputPriority) {
      await alert({
        header: 'Failed',
        message: 'Task or priority cannot be empty',
        backdropDismiss: false,
        buttons: ['OK']
      })

      return;
    }

    await loading({
      message: 'Loading',
      duration: 500,
      spinner: 'bubbles'
    })

    await addTodo({
      id: new Date().getTime(),
      priority: inputPriority,
      task: inputTask,
      complete: false
    })

    setTimeout(() => {
      router.push('/')
    }, 500) 
  }

  useIonViewWillEnter(() => {
    if (task.current && priority.current) {
      task.current.value = ''
      priority.current.value = null
    }
  }, [])

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonTitle>
            Add Todo
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <form onSubmit={handleAddTodo}>
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
            <IonButton expand="block" onClick={handleAddTodo} disabled={!task}>Add</IonButton>
          </div>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default CreateTodo;
