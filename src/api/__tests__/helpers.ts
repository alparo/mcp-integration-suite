import { integrationContent } from "../../generated/IntegrationContent";
import { getCurrentDestination } from "../api_destination";

export const deletePackage = async (pkgId: string) => {
    const { integrationPackagesApi } = integrationContent();
    await integrationPackagesApi
        .requestBuilder()
        .delete(pkgId)
        .execute(await getCurrentDestination());
};

export const safeStringify = (obj: unknown): string => {
    const seen = new WeakSet();
    return JSON.stringify(
        obj,
        (key, value) => {
            if (typeof value === "object" && value !== null) {
                if (seen.has(value)) {
                    return "[Circular]";
                }
                seen.add(value);
            }
            if (typeof value === "function") {
                return value.toString();
            }
            return value;
        },
        2
    );
};
