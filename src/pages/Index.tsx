import { TradeCalculator } from "@/components/TradeCalculator";
import { Notes } from "@/components/Notes";
import { NessieValue } from "@/components/NessieValue";

const Index = () => {
  return (
    <>
      <TradeCalculator />
      <div className="mt-12">
        <NessieValue />
      </div>
      <Notes />
    </>
  );
};

export default Index;
