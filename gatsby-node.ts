import * as path from "path"

// @ts-ignore
export const onCreateWebpackConfig = ({ actions }) => {
    actions.setWebpackConfig({
        resolve: {
            alias: {
                "@/components": path.resolve(__dirname, "src/components"),
                "@/lib/utils": path.resolve(__dirname, "src/lib/utils"),
            },
        },
    })
}