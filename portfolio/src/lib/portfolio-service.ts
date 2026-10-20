import defaultPortfolioData from "@/data/portfolio-data.json";
import { PortfolioData } from "@/lib/portfolio-types";
import { databases } from "@/lib/appwrite";

/**
 * Fetch portfolio data dynamically from Appwrite if configured,
 * otherwise seamlessly fall back to local JSON config.
 */
export async function getPortfolioData(): Promise<PortfolioData> {
  const databaseId = process.env.NEXT_PUBLIC_APPWRITE_PORTFOLIO_DATABASE_ID;
  const collectionId = process.env.NEXT_PUBLIC_APPWRITE_PORTFOLIO_COLLECTION_ID;

  if (databaseId && collectionId && databases) {
    try {
      const response = await databases.listDocuments(databaseId, collectionId);
      if (response && response.documents && response.documents.length > 0) {
        // Look for custom config document or merge documents
        const configDoc = response.documents[0] as unknown as Partial<PortfolioData>;
        return {
          ...(defaultPortfolioData as unknown as PortfolioData),
          ...configDoc,
          name: configDoc.name || defaultPortfolioData.name,
          title: configDoc.title || defaultPortfolioData.title,
          bio: configDoc.bio || defaultPortfolioData.bio,
          email: configDoc.email || defaultPortfolioData.email,
          phone: configDoc.phone || defaultPortfolioData.phone,
          location: configDoc.location || defaultPortfolioData.location,
          experiences: (configDoc.experiences as any) || (defaultPortfolioData.experiences as any),
          education: (configDoc.education as any) || (defaultPortfolioData.education as any),
          skillCategories: (configDoc.skillCategories as any) || (defaultPortfolioData.skillCategories as any),
          projects: (configDoc.projects as any) || (defaultPortfolioData.projects as any),
          resources: (configDoc.resources as any) || (defaultPortfolioData.resources as any),
          socials: (configDoc.socials as any) || (defaultPortfolioData.socials as any),
        };
      }
    } catch {
      // Graceful fallback to default local configuration on network/config issues
    }
  }

  return defaultPortfolioData as unknown as PortfolioData;
}
