import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonList,
  IonListHeader,
  IonLabel,
  IonItem,
  IonReorderGroup,
  IonReorder,
  ItemReorderEventDetail,
  IonIcon,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  useIonAlert,
} from "@ionic/react";
import { useEffect, useState } from "react";
import { checkmarkCircle, closeCircle, reorderThreeOutline, trashBin } from "ionicons/icons";
import { TodoItem, useTodo } from "../../hooks/useTodo";
import _ from "lodash";
import Container from "../../components/Container";
import { IonItemSlidingCustomEvent } from "@ionic/core";

const Todo: React.FC = () => {
  const { todos, orderTodo, completeTodo, deleteTodo } = useTodo();
  const [disabledOrder, setDisabledOrder] = useState<boolean | undefined>(true);
  const [alert] = useIonAlert()
  const groupTodos = _.groupBy(todos, (todos) => todos.priority);

  async function handleReorder(e: CustomEvent<ItemReorderEventDetail>, groupTodos: TodoItem[]) {
    const order = e.detail.complete(groupTodos);
    await orderTodo(order)
  }

  async function handleComplete(e: IonItemSlidingCustomEvent<any>, todoId: Number) {
    if (e.detail.ratio === 1) {
      e.target.closeOpened()
    
      setTimeout(() => {
        completeTodo(todoId)
      }, 400);
    } else if (e.detail.ratio === -1) {
      e.target.closeOpened()

      alert({
        header: 'Alert!',
        message: 'Are you sure?',
        backdropDismiss: false,
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel'
          },
          {
            text: 'Delete',
            role: 'Delete',
            handler: () => {
              deleteTodo(todoId)
            }
          }
        ]
      })
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Todo App</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Todo App</IonTitle>
          </IonToolbar>
        </IonHeader>
        <Container>
          <div className="ion-padding" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ flexGrow: 1 }}>
              <IonButton expand="block" routerLink="/create">
                Add Todo
              </IonButton>
            </div>
            <div>
              <IonButton
                color={!disabledOrder ? "medium" : "primary"}
                onClick={() => setDisabledOrder(!disabledOrder)}
              >
                <IonIcon icon={reorderThreeOutline}></IonIcon>
              </IonButton>
            </div>
          </div>
          <IonList>
            { Object.entries(groupTodos).map((item, index) => {
              let label;
              let color;

              switch (item[0]) {
                case "1":
                  label = "Urgent";
                  color = "danger";
                  break;
                case "2":
                  label = "High";
                  color = "warning";
                  break;
                default:
                  label = "Normal";
                  color = "primary";
                  break;
              }

              return (
                <div key={"header" + index}>
                  <IonListHeader lines="inset">
                    <IonLabel
                      color={color}
                      style={{ fontWeight: "bold", fontSize: "20px" }}
                    >
                      {label}
                    </IonLabel>
                  </IonListHeader>
                  <IonReorderGroup
                    disabled={disabledOrder}
                    onIonItemReorder={(e) => handleReorder(e, item[1])}
                  >
                    {item[1].map((todo: TodoItem) => {
                      return (
                        <IonItemSliding key={''+todo.id} onIonDrag={(e) => handleComplete(e, todo.id)}>
                          <IonItem
                            button
                            detail={false}
                            routerLink={'/edit/' + todo.id}
                          >
                            <IonLabel
                              style={{
                                textDecoration: todo.complete
                                  ? "line-through"
                                  : "none",
                              }}
                            >
                              {todo.task}
                            </IonLabel>
                            {todo.complete ? (
                              <IonIcon
                                icon={checkmarkCircle}
                                color="success"
                                slot="end"
                              ></IonIcon>
                            ) : (
                              ""
                            )}
                            <IonReorder slot="end"></IonReorder>
                          </IonItem>

                          <IonItemOptions side="start">
                            <IonItemOption color={'danger'}>
                              <IonIcon slot="icon-only" icon={trashBin}></IonIcon>
                            </IonItemOption>
                          </IonItemOptions>

                          { todo.complete 
                            ? <IonItemOptions side="end">
                              <IonItemOption color={'warning'}>
                                <IonIcon slot="icon-only" icon={closeCircle}></IonIcon>
                              </IonItemOption>
                            </IonItemOptions> 
                            : <IonItemOptions side="end">
                              <IonItemOption color={'success' }>
                                <IonIcon slot="icon-only" icon={checkmarkCircle}></IonIcon>
                              </IonItemOption>
                            </IonItemOptions> }
                          
                        </IonItemSliding>
                      );
                    })}
                  </IonReorderGroup>
                </div>
              );
            })}
          </IonList>
        </Container>
      </IonContent>
    </IonPage>
  );
};

export default Todo;
