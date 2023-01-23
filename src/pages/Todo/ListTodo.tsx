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
  useIonViewWillEnter,
} from "@ionic/react";
import { checkmarkCircle, closeCircle, reorderThreeOutline, trashBin } from "ionicons/icons";
import { TodoItem, getTodo, orderTodo, completeTodo, deleteTodo } from "./todo";
import { IonItemSlidingCustomEvent } from "@ionic/core";
import { useState } from "react";
import Container from "../../components/Container";
import _ from "lodash";

const ListTodo: React.FC = () => {
  const [todos, setTodos] = useState<TodoItem[]>([])
  const [disabledOrder, setDisabledOrder] = useState<boolean | undefined>(true);
  const [alert] = useIonAlert()
  const groupTodos = _.groupBy(todos, (todos) => todos.priority);

  const fetch = async () => {
    const todos = await getTodo()
    setTodos(todos)
  }

  useIonViewWillEnter(() => {
    const init = async () => {
      await fetch()
    }

    init()
  }, []);
  
  async function handleReorder(e: CustomEvent<ItemReorderEventDetail>, groupTodos: TodoItem[]) {
    const order = e.detail.complete(groupTodos);
    const todos = await orderTodo(order)
    setTodos(todos)
  }

  async function handleComplete(e: IonItemSlidingCustomEvent<any>, todoId: Number) {
    if (e.detail.ratio === 1) {
      setTimeout(async () => {
        const todos = await completeTodo(todoId)
        setTodos(todos)
      }, 400);
      
    } else if (e.detail.ratio === -1) {
      await alert({
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
            handler: async () => {
              await deleteTodo(todoId)
              const todos = await completeTodo(todoId)
              setTodos(todos)
            }
          }
        ]
      })
    }

    if (e.detail.ratio === -1 || e.detail.ratio === 1) {
      e.target.closeOpened()
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
                    {item[1].map((todo: TodoItem, index: number) => {
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
                              {(index+1) + '. ' + todo.task}
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

export default ListTodo;
