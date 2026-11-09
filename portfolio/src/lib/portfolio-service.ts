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
        const defaultData = defaultPortfolioData as unknown as PortfolioData;
        return {
          ...defaultData,
          ...configDoc,
          name: configDoc.name || defaultData.name,
          title: configDoc.title || defaultData.title,
          bio: configDoc.bio || defaultData.bio,
          email: configDoc.email || defaultData.email,
          phone: configDoc.phone || defaultData.phone,
          location: configDoc.location || defaultData.location,
          experiences: configDoc.experiences || defaultData.experiences,
          education: configDoc.education || defaultData.education,
          certificates: configDoc.certificates || defaultData.certificates,
          skillCategories: configDoc.skillCategories || defaultData.skillCategories,
          projects: configDoc.projects || defaultData.projects,
          resources: configDoc.resources || defaultData.resources,
          socials: configDoc.socials || defaultData.socials,
        };
      }
    } catch {
      // Graceful fallback to default local configuration on network/config issues
    }
  }

  return defaultPortfolioData as unknown as PortfolioData;
}
