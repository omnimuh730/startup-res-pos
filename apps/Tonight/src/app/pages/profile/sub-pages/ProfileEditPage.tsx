import { useState } from "react";
import { Avatar } from "../../../components/ds/Avatar";
import { Button } from "../../../components/ds/Button";
import { Input } from "../../../components/ds/Input";
import { PageHeader } from "../profileHelpers";

export function ProfileEditPage({ onBack }: { onBack: () => void }) {
  const [name, setName] = useState("Alex Chen");
  const [phone, setPhone] = useState("+1 (555) 234-5678");
  const [username, setUsername] = useState("alexchen");
  return (
    <div className="pb-8">
      <PageHeader title="Edit Profile" onBack={onBack} />
      <div className="flex flex-col items-center mb-6">
        <Avatar name="Alex Chen" size="2xl" className="mb-3" />
        <Button variant="link" size="xs">Change Photo</Button>
      </div>
      <div className="space-y-4">
        <Input label="Full Name" value={name} onChange={e => setName(e.target.value)} fullWidth />
        <Input label="Phone Number" value={phone} onChange={e => setPhone(e.target.value)} fullWidth />
        <Input label="Username" value={username} onChange={e => setUsername(e.target.value)} fullWidth />
      </div>
      <div className="flex gap-3 mt-6">
        <Button variant="ghost" onClick={onBack} className="flex-1">Cancel</Button>
        <Button variant="primary" onClick={onBack} className="flex-1">Save Changes</Button>
      </div>
    </div>
  );
}
