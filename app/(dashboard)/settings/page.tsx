import { TaxSettingsForm } from "@/components/settings/tax-settings-form"

export default function SettingsPage() {
  return (
    <div className="container py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-muted-foreground">Manage your application settings.</p>
      </div>
      <div className="grid gap-6">
        <TaxSettingsForm />
        {/* Add other settings forms here */}
      </div>
    </div>
  )
} 