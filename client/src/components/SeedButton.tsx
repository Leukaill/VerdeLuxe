import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Database } from 'lucide-react';
import { seedFirestoreSimple } from '@/lib/seedFirestore';
import { useToast } from '@/hooks/use-toast';

const SeedButton = () => {
  const [seeding, setSeeding] = useState(false);
  const { toast } = useToast();

  const handleSeed = async () => {
    setSeeding(true);
    try {
      await seedFirestoreSimple();
      toast({
        title: "Success",
        description: "Firestore database seeded successfully!"
      });
    } catch (error) {
      console.error('Seeding error:', error);
      toast({
        title: "Error", 
        description: "Seeding failed. Check console for details.",
        variant: "destructive"
      });
    } finally {
      setSeeding(false);
    }
  };

  // Only show in development mode
  if (import.meta.env.MODE !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        onClick={handleSeed}
        disabled={seeding}
        className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
      >
        {seeding ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Seeding...
          </>
        ) : (
          <>
            <Database className="h-4 w-4 mr-2" />
            Seed DB
          </>
        )}
      </Button>
    </div>
  );
};

export default SeedButton;