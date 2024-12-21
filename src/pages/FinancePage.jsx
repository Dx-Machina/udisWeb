//=========================================================================================================
// Finance Page 
//=========================================================================================================
import React from "react";
import TopBar from "../components/TopBar";
import BurgerMenu from "../components/BurgerMenu";
import Card from "../components/Card";
import "../styles/FinancePage.css";

const FinancePage = () => {
  const handleExpand = () => {
    console.log("Card expanded");
  };

  return (
    <div className="finance-page">
      <TopBar title="Finances" />
      <BurgerMenu />

      <div className="CardGrid">
        <Card
          RichMedia="/images/Default_Card_Image.jpg"
          tag="Financial Brief"
          title="Monthly Overview"
          subtitle="Track your spending and income"
          details="Detailed breakdown of your finances."
          buttonLabel="Expand"
          onButtonClick={handleExpand}
        />
        <Card
          RichMedia="/images/Default_Card_Image.jpg"
          tag="Wallet"
          title="Wallet Balance"
          subtitle="$10,000"
          details="Request or send money securely."
          buttonLabel="Expand"
        />
        <Card
          RichMedia="/images/Default_Card_Image.jpg"
          tag="Connect"
          title="Connect Accounts"
          subtitle="Link your bank or credit cards"
          details="Add new financial accounts to UDIS."
          buttonLabel="+ Add"
        />







        <Card
          variant="minimal"
          title="Minimal Title"
          subtitle="Minimal Subtitle"
          details="Minimal cards can be used for simpler layouts."
        />
        <Card
          variant="highlighted"
          title="Highlighted Title"
          subtitle="Important information"
          details="This card is highlighted to grab attention."
          RichMedia="/images/highlighted.jpg"
        />
        <Card
          variant="compact"
          title="Compact Title"
          subtitle="Compact Subtitle"
          details="This is a compact variant designed for smaller spaces."
        />
        <Card
          variant="interactive"
          title="Interactive Title"
          subtitle="Interactive Subtitle"
          details="Hover over this card for more effects."
          RichMedia="/images/interactive.jpg"
        />
      </div>
    </div>
  );
};

export default FinancePage;