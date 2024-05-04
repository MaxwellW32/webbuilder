import { builtComponent, userComponent } from "@/types";
import globalDynamicComponents from "@/utility/globalComponents";
import path from "path";

export default async function buildUserComponents(userComponents: userComponent[]): Promise<builtComponent[]> {
    return Promise.all(userComponents.map(async eachComponent => {
        const fullPath = path.join("userComponents", eachComponent.currentLayout!.mainFileName)

        try {
            const Component = await globalDynamicComponents(fullPath)[eachComponent.id]()

            return {
                ...eachComponent,
                component: Component
            }
        } catch (error) {
            console.log(`$err reading`, error);
            return {
                ...eachComponent,
                component: undefined
            }
        }

    }))
}