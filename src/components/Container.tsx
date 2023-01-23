import { App } from "@capacitor/app";
import { isPlatform, useIonAlert } from "@ionic/react";
import { useEffect } from "react";
import { useLocation } from "react-router";

interface ContainerProps {
  children?: React.ReactNode
}

const Container: React.FC<ContainerProps> = ({ children }) => {
  const router = useLocation();
  const [presentAlert] = useIonAlert();

  useEffect(() => {
    App.addListener("backButton", () => {
      if (isPlatform("android")) {
        if (router.pathname === '/') {
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
    
  }, [presentAlert, router.pathname]);

  return (
    <div className="container">
      { children }
    </div>
  );
};

export default Container;
