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
import { useState } from "react";
import { useHistory } from "react-router";
import { TodoPriorityEnum, addTodo } from "./todo";

const CreateTodo: React.FC = () => {
  const [task, setTask] = useState<string | null | undefined>('');
  const [priority, setPriority] = useState<TodoPriorityEnum|undefined>(undefined)
  const [alert] = useIonAlert();
  const [loading] = useIonLoading();
  const router = useHistory()

  async function handleAddTodo() {
    if (!task || !priority) {
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
      priority: priority,
      task: task,
      complete: false
    })

    setTimeout(() => {
      router.push('/')
    }, 500) 
  }

  useIonViewWillEnter(() => {
    setTask('')
    setPriority(undefined)
  }, [])

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonTitle>
            Add Todo Test
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
                value={task}
                onIonChange={e => setTask(e.target.value)}
              ></IonTextarea>
            </IonItem>
            <IonItem>
              <IonLabel position="fixed">Priority</IonLabel>
              <IonSelect
                placeholder="Priority"
                value={priority}
                onIonChange={e => setPriority(e.target.value)}
              >
                <IonSelectOption value={TodoPriorityEnum.normal}>Normal</IonSelectOption>
                <IonSelectOption value={TodoPriorityEnum.high}>High</IonSelectOption>
                <IonSelectOption value={TodoPriorityEnum.urgent}>Urgent</IonSelectOption>
              </IonSelect>
            </IonItem>
          </IonList>
          <div className="ion-margin-vertical">
            <IonButton expand="block" onClick={handleAddTodo} disabled={task === '' || priority === undefined}>Add</IonButton>
          </div>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default CreateTodo;
