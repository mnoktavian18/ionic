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
} from "@ionic/react";
import { useState } from "react";
import { useHistory } from "react-router";
import { TodoPriorityEnum, useTodo } from "../../hooks/useTodo";

const CreateTodo: React.FC = () => {
  const { addTodo } = useTodo();
  const [priority, setPriority] = useState<TodoPriorityEnum>(TodoPriorityEnum.normal);
  const [task, setTask] = useState<string | null | undefined>('');
  const [alert] = useIonAlert();
  const router = useHistory()

  function handleAddTodo() {
    if (!task) {
      alert({
        header: 'Failed',
        message: 'Task cannot be empty',
        backdropDismiss: false,
        buttons: ['OK']
      })

      return;
    }

    addTodo({
      id: new Date().getTime(),
      priority: priority,
      task: task,
      complete: false
    })

    router.push('/')
  }

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
          <IonButton expand="block" onClick={handleAddTodo} disabled={!task}>Add</IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default CreateTodo;
