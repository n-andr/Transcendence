import Button from "../components/button";

export default function ComponentSandbox() {
  return (
    <div className="min-h-screen bg-background p-8 space-y-6">
      <h1 className="text-2xl font-semibold text-textPrimary">
        Component Sandbox
      </h1>

      <div className="space-x-4">
        <Button>Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button disabled>Disabled</Button>
      </div>
    </div>
  );