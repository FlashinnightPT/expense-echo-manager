
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui-custom/Card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSettingsState } from "../hooks/useSettingsState";
import { useAuth } from "@/hooks/useAuth";

interface CurrencySettingsProps {
  className?: string;
}

const CurrencySettings = ({ className }: CurrencySettingsProps) => {
  const { settings, handleChange } = useSettingsState();
  const { canEdit } = useAuth();

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Moeda e Formato</CardTitle>
        <CardDescription>
          Personalize o formato de moeda e data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="currency">Moeda</Label>
          <Select
            value={settings.currency}
            onValueChange={(value) => handleChange("currency", value)}
            disabled={!canEdit}
          >
            <SelectTrigger id="currency" className="w-full">
              <SelectValue placeholder="Selecione a moeda" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="EUR">Euro (€)</SelectItem>
              <SelectItem value="USD">Dólar Americano ($)</SelectItem>
              <SelectItem value="GBP">Libra Esterlina (£)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="currencySymbol">Símbolo da Moeda</Label>
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Select
              value={settings.currencySymbol}
              onValueChange={(value) => handleChange("currencySymbol", value)}
              disabled={!canEdit}
            >
              <SelectTrigger id="currencySymbol" className="w-24">
                <SelectValue placeholder="Símbolo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="€">€</SelectItem>
                <SelectItem value="$">$</SelectItem>
                <SelectItem value="£">£</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="text"
              placeholder="1.234,56"
              value="1.234,56"
              disabled
              className="text-right"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="dateFormat">Formato de Data</Label>
          <Select
            value={settings.dateFormat}
            onValueChange={(value) => handleChange("dateFormat", value)}
            disabled={!canEdit}
          >
            <SelectTrigger id="dateFormat" className="w-full">
              <SelectValue placeholder="Selecione o formato de data" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dd/MM/yyyy">DD/MM/AAAA (31/12/2023)</SelectItem>
              <SelectItem value="MM/dd/yyyy">MM/DD/AAAA (12/31/2023)</SelectItem>
              <SelectItem value="yyyy-MM-dd">AAAA-MM-DD (2023-12-31)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrencySettings;
