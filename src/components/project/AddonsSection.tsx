import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Package, Check, Clock, X } from 'lucide-react';
import { ProjectAddon } from '@/hooks/useProject';
import { AddonConfig } from '@/hooks/usePricing';

interface AddonsSectionProps {
  addons: ProjectAddon[];
  addonConfig: AddonConfig | null;
  onAddAddon?: (addonKey: string) => void;
  className?: string;
}

export const AddonsSection: React.FC<AddonsSectionProps> = ({
  addons,
  addonConfig,
  onAddAddon,
  className = ''
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'inactive':
        return <X className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'نشط';
      case 'pending':
        return 'في انتظار التفعيل';
      case 'inactive':
        return 'غير نشط';
      default:
        return 'غير محدد';
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'inactive':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getAvailableAddons = () => {
    if (!addonConfig) return [];
    
    const activeAddonKeys = addons.map(addon => addon.addon_key);
    return Object.entries(addonConfig).filter(
      ([key]) => !activeAddonKeys.includes(key)
    );
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Current Add-ons */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center">
            <Package className="h-5 w-5 ml-2" />
            الإضافات الحالية
          </h3>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 ml-1" />
                إضافة خدمة
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>إضافة خدمات جديدة</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {getAvailableAddons().map(([key, addon]) => (
                  <Card key={key} className="p-4 cursor-pointer hover:bg-accent transition-colors">
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold">{addon.name}</h4>
                        <p className="text-sm text-muted-foreground">{addon.description}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-primary">{addon.price.toLocaleString()} ج.م</p>
                          <p className="text-xs text-muted-foreground">{addon.duration}</p>
                        </div>
                        <Button 
                          size="sm"
                          onClick={() => {
                            onAddAddon?.(key);
                            setIsDialogOpen(false);
                          }}
                        >
                          إضافة
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              {getAvailableAddons().length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  جميع الإضافات المتاحة مفعلة بالفعل
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>

        {addons.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            لا توجد إضافات مفعلة حالياً
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addons.map((addon) => {
              const config = addonConfig?.[addon.addon_key];
              return (
                <Card key={addon.id} className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{config?.name || addon.addon_key}</h4>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        {getStatusIcon(addon.status)}
                        <Badge variant={getStatusBadgeVariant(addon.status)}>
                          {getStatusText(addon.status)}
                        </Badge>
                      </div>
                    </div>
                    
                    {config && (
                      <>
                        <p className="text-sm text-muted-foreground">{config.description}</p>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-bold text-primary">{config.price.toLocaleString()} ج.م</p>
                            <p className="text-xs text-muted-foreground">{config.duration}</p>
                          </div>
                        </div>
                      </>
                    )}
                    
                    <p className="text-xs text-muted-foreground">
                      تم الإضافة في: {new Date(addon.created_at).toLocaleDateString('ar-EG')}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </Card>

      {/* Add-ons Store Preview */}
      {addonConfig && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">متجر الإضافات</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(addonConfig).slice(0, 3).map(([key, addon]) => (
              <Card key={key} className="p-4 opacity-75">
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm">{addon.name}</h4>
                  <p className="text-xs text-muted-foreground line-clamp-2">{addon.description}</p>
                  <div className="flex justify-between items-center">
                    <p className="font-bold text-sm text-primary">{addon.price.toLocaleString()} ج.م</p>
                    <p className="text-xs text-muted-foreground">{addon.duration}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <div className="text-center mt-4">
            <Button variant="outline" size="sm">
              عرض جميع الإضافات
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};