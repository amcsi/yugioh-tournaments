/**
 * Determines the store type based on the store name.
 * @param storeName - The name of the store
 * @returns The store type category
 */
export function getStoreType(storeName: string): string {
  const name = storeName.toLowerCase();
  
  if (name.includes("metagame")) {
    return "Metagame";
  } else if (name.includes("remete") || name.includes("remetebarlang")) {
    return "Remetebarlang";
  } else if (name.includes("sas és kos") || name.includes("bar of legends")) {
    return "SAS és KOS";
  } else if (name.includes("pöttyös") || name.includes("zebra")) {
    return "Pöttyös Zebra";
  } else if (name.includes("sport") || name.includes("kártya")) {
    return "Sport Kártya";
  } else if (name.includes("játék") && name.includes("céh")) {
    return "Játék Céh";
  } else if (name.includes("ratmayer")) {
    return "Ratmayer";
  } else {
    return "Other";
  }
}
