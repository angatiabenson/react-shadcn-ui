import { useState } from "react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { toast } from "sonner";

export function Counter() {
  const [count, setCount] = useState(0);

  function handleAction(action: "increment" | "decrement") {
    if (action === "increment") {
      setCount((value) => value + 1);
    } else {
      if (count === 0) {
        toast.error("Count cannot be less than zero");
        return;
      }
      setCount((value) => value - 1);
    }
  }

  return (
    <Card className="w-full max-w-sm flex justify-center">
      <CardHeader>
        <CardTitle>Counter App</CardTitle>
        <CardDescription>
          A simple counter using React and Tailwind CSS.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-lg mb-4 block text-center">Count: {count}</p>
        <div className="grid grid-cols-2 content-evenly gap-3">
          <Button onClick={() => handleAction("increment")}>Increment</Button>
          <Button variant="outline" onClick={() => handleAction("decrement")}>
            Decrement
          </Button>
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-sm">Developed by Angatia Benson</p>
      </CardFooter>
    </Card>
  );
}
