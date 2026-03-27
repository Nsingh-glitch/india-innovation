import { useEffect } from "react";
import { supabase } from "./lib/supabaseClient";

function TestConnection() {
  useEffect(() => {
    async function test() {
      const { data, error } = await supabase
        .from("processed_events")
        .select("*")

      console.log("DATA:", data);
      console.log("ERROR:", error);
    }

    test();
  }, []);

  return <h2>Check Console</h2>;
}

export default TestConnection;