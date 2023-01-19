import { App } from "@capacitor/app";
import { isPlatform, useIonAlert, useIonRouter } from "@ionic/react";
import { useEffect } from "react";

interface ContainerProps {
  children?: React.ReactNode
}

const Container: React.FC<ContainerProps> = ({ children }) => {
  const useRouter = useIonRouter();
  const [presentAlert] = useIonAlert();

  useEffect(() => {
    App.addListener("backButton", () => {
      if (isPlatform("android")) {
        if (!useRouter.canGoBack()) {
          presentAlert({
            header: "Are you sure you want to leave?",
            backdropDismiss: false,
            buttons: [
              {
                text: "Cancel",
                role: "cancel",
              },
              {
                text: "Leave",
                role: "leave",
              },
            ],
            onDidDismiss: (e: CustomEvent) => {
              if (e.detail.role === "leave") {
                App.exitApp();
              }
            },
          });
        }
      }
    });

    return () => {
      App.removeAllListeners();
    };
    
  }, [presentAlert, useRouter]);

  return (
    <div className="container">
      { children }
    </div>
  );
};

export default Container;
