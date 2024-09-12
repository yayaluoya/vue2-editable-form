import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import fs from "fs";
import path from "path";
import vitePluginAliOss from "vite-plugin-ali-oss";

let aliYunOssOpPath = path.join(__dirname, "./.local/oss.config.json");

const aliYunOptions = {
  url: "",
  region: "",
  accessKeyId: "",
  accessKeySecret: "",
  bucket: "",
  overwrite: true,
};

if (
  fs
    .statSync(aliYunOssOpPath, {
      throwIfNoEntry: false,
    })
    ?.isFile()
) {
  let _ = JSON.parse(fs.readFileSync(aliYunOssOpPath).toString());
  aliYunOptions.url = _.url;
  aliYunOptions.region = _.region;
  aliYunOptions.accessKeyId = _.accessKeyId;
  aliYunOptions.accessKeySecret = _.accessKeySecret;
  aliYunOptions.bucket = _.bucket;
} else {
  console.log("找不到阿里云配置文件", aliYunOssOpPath);
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const prod = mode === "production";
  let base = prod ? aliYunOptions.url + "/" : "/";
  let outDir = "dist";
  return {
    base,
    plugins: [vue(), vueJsx(), vitePluginAliOss(aliYunOptions)],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    build: {
      /** 指定输出路径 */
      outDir: outDir,
      //   关闭文件计算
      reportCompressedSize: false,
      //   关闭生成map文件 可以达到缩小打包体积
      sourcemap: false, // 这个生产环境一定要关闭，不然打包的产物会很大
      // rollupOptions: {  //不对文件名使用 hash
      //     output: {
      //     // 重点在这里哦
      //         // entryFileNames: `assets/[name].${timestamp}.js`,
      //         // chunkFileNames: `assets/[name].${timestamp}.js`,
      //         // assetFileNames: `assets/[name].${timestamp}.[ext]`
      //         entryFileNames: `assets/[name].js`,
      //         chunkFileNames: `assets/[name].js`,
      //         assetFileNames: `assets/[name].[ext]`,
      //     },
      // },
    },
  };
});
