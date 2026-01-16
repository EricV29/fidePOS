import { useEffect, useState } from "react";
import Sidebar from "@components/Sidebar";
import { Outlet } from "react-router-dom";
import type { UserSession } from "@typesm/users";
import { useLoading } from "@context/LoadingContext";

export default function MainPage() {
  const [isOpen, setIsOpen] = useState(true);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024);
  const [installDate, setInstallDate] = useState<string | null>(null);
  const [session, setSession] = useState<UserSession | null>(null);
  const { setLoading } = useLoading();

  const fetchSession = async () => {
    try {
      const userData = await window.electronAPI.getSession();

      if (userData) {
        setSession(userData);
      }
    } catch (error) {
      console.error("Fetch error session:", error);
    }
  };

  useEffect(() => {
    fetchSession();
  }, []);

  useEffect(() => {
    setLoading(true);
    window.electronAPI.installDate().then((date) => {
      setInstallDate(date);
      setLoading(false);
    });

    function handleResize() {
      const large = window.innerWidth >= 1024;

      setIsLargeScreen(large);

      if (!large) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    if (!isLargeScreen) return;
    setIsOpen((prev) => !prev);
  };

  /*
  const [msgReply, setMsgReply] = useState("");
  const [msgReplyPrivate, setMsgReplyPrivate] = useState("");

  useEffect(() => {
    // GLOBAL LISTENER REPLY
    window.electronAPI.onMessageReply((data) => {
      setMsgReply(data);
    });

    // GLOBAL LISTENER PRIVATE
    window.electronAPI.onMessageReplyPrivate((data) => {
      setMsgReplyPrivate(data);
    });
  }, []);

  const sendMessage = () => {
    window.electronAPI.sendMessage("Hello from Main!");
  };

  const sendMessagePrivate = () => {
    window.electronAPI.sendMessagePrivate("Hello from Main Private!");
  };
*/

  return (
    <>
      <div className="w-screen h-screen overflow-hidden flex p-[13px] gap-[15px] dark:bg-[#353935]">
        <Sidebar
          isOpen={isOpen}
          toggleSidebar={toggleSidebar}
          session={session}
        />
        <main className="h-full min-h-0 w-full min-w-0 p-5 rounded-[30px] bg-[#ffffff] border border-[#B3B3B340] flex flex-col overflow-hidden dark:bg-[#353935]">
          {installDate && <Outlet context={{ installDate, session }} />}
        </main>
      </div>
    </>
  );
}
