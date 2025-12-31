import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Day Climate Risk Management",
  description: "Professional climate risk management and strategy platform for organizations",
};

export default function ClimateRiskManagementLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
