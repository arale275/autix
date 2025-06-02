"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { carsApi } from "@/lib/api/cars";
import { Car } from "@/lib/api/types";
import { toast } from "sonner";

interface CarFormProps {
  car?: Car;
  mode?: "create" | "edit";
  onSuccess?: () => void;
}

const FUEL_TYPES = [
  { value: "gasoline", label: "בנזין" },
  { value: "diesel", label: "דיזל" },
  { value: "hybrid", label: "היברידי" },
  { value: "electric", label: "חשמלי" },
];

const TRANSMISSION_TYPES = [
  { value: "manual", label: "ידני" },
  { value: "automatic", label: "אוטומטי" },
];

const CONDITION_TYPES = [
  { value: "new", label: "חדש" },
  { value: "used", label: "משומש" },
];

export default function CarForm({
  car,
  mode = "create",
  onSuccess,
}: CarFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    make: car?.make || "",
    model: car?.model || "",
    year: car?.year?.toString() || "",
    price: car?.price?.toString() || "",
    mileage: car?.mileage?.toString() || "",
    fuelType: car?.fuelType || "",
    transmission: car?.transmission || "",
    color: car?.color || "",
    description: car?.description || "",
    city: car?.city || "",
    engineSize: car?.engineSize || "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const carData = {
        ...formData,
        year: parseInt(formData.year),
        price: parseInt(formData.price),
        mileage: parseInt(formData.mileage),
      };

      if (mode === "edit" && car?.id) {
        await carsApi.updateCar(car.id, carData);
        toast.success("הרכב עודכן בהצלחה");
      } else {
        await carsApi.addCar(carData);
        toast.success("הרכב נוסף בהצלחה");
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/dealer/cars");
      }
    } catch (error: any) {
      toast.error(error.message || "אירעה שגיאה");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{mode === "edit" ? "עריכת רכב" : "הוספת רכב חדש"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* פרטי רכב בסיסיים */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="make">יצרן *</Label>
              <Input
                id="make"
                value={formData.make}
                onChange={(e) => handleChange("make", e.target.value)}
                placeholder="טויוטה, הונדה, פולקסוואגן..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">דגם *</Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => handleChange("model", e.target.value)}
                placeholder="קורולה, סיוויק, גולף..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="year">שנת יצור *</Label>
              <Input
                id="year"
                type="number"
                min="1990"
                max="2025"
                value={formData.year}
                onChange={(e) => handleChange("year", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">מחיר (₪) *</Label>
              <Input
                id="price"
                type="number"
                min="0"
                value={formData.price}
                onChange={(e) => handleChange("price", e.target.value)}
                placeholder="150000"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mileage">קילומטראז' *</Label>
              <Input
                id="mileage"
                type="number"
                min="0"
                value={formData.mileage}
                onChange={(e) => handleChange("mileage", e.target.value)}
                placeholder="50000"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="color">צבע</Label>
              <Input
                id="color"
                value={formData.color}
                onChange={(e) => handleChange("color", e.target.value)}
                placeholder="לבן, שחור, כסף..."
              />
            </div>
          </div>

          {/* מאפיינים טכניים */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>סוג דלק *</Label>
              <Select
                value={formData.fuelType}
                onValueChange={(value) => handleChange("fuelType", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="בחר סוג דלק" />
                </SelectTrigger>
                <SelectContent>
                  {FUEL_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>תיבת הילוכים *</Label>
              <Select
                value={formData.transmission}
                onValueChange={(value) => handleChange("transmission", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="בחר תיבת הילוכים" />
                </SelectTrigger>
                <SelectContent>
                  {TRANSMISSION_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* פרטי יצירת קשר */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">עיר *</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleChange("city", e.target.value)}
                placeholder="תל אביב, חיפה, באר שבע..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="engineSize">נפח מנוע</Label>
              <Input
                id="engineSize"
                value={formData.engineSize}
                onChange={(e) => handleChange("engineSize", e.target.value)}
                placeholder="1.6, 2.0, 3.0..."
              />
            </div>
          </div>

          {/* תיאור */}
          <div className="space-y-2">
            <Label htmlFor="description">תיאור נוסף</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="פרטים נוספים על הרכב, ציוד מיוחד, מצב כללי..."
              rows={4}
            />
          </div>

          {/* כפתורי פעולה */}
          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "שומר..." : mode === "edit" ? "עדכן רכב" : "הוסף רכב"}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dealer/cars")}
              disabled={loading}
            >
              ביטול
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
