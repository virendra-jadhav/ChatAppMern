import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";

export function useTypingSingleUserHook() {
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);

  // Emit typing event when user starts typing
  const handleTyping = () => {
    // socket.emit("typing", { receiverId });
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      //   socket.emit("stopTyping", { receiverId });
    }, 1500);
  };

  // Listen for typing status from other user
  useEffect(() => {
    // socket.on("userTyping", () => setIsTyping(true));
    // socket.on("userStopTyping", () => setIsTyping(false));

    return () => {
      //   socket.off("userTyping");
      //   socket.off("userStopTyping");
    };
  }, []);

  return [isTyping, handleTyping];
}
