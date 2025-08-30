import { useSearchParams } from "react-router-dom";
import Home from "./Home";

export default function ChatEntry() {
  const [searchParams] = useSearchParams();
  const agent = searchParams.get("agent");

  if (agent === "media-agent") {
    return <Home />;
  }
  return <div>Chọn Agent</div>;
}
