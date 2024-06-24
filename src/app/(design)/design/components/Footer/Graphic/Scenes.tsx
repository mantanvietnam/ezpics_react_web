import React from "react";
import { useStyletron } from "baseui";
import Add from "@/components/Icons/Add";
import useDesignEditorPages from "@/hooks/useDesignEditorScenes";
import { nanoid } from "nanoid";
import { getDefaultTemplate } from "@/constants/design-editor";
import { useEditor } from "@layerhub-io/react";
import { IScene } from "@layerhub-io/types";
import { Block } from "baseui/block";
import { toast } from "react-toastify";
import { FaTrash } from "react-icons/fa";
import { loadVideoEditorAssets } from "@/utils/media/video";
import "../../../../design/components/Preview/newloading.css";
import { useAppSelector } from "@/hooks/hook";
import axios from "axios";
import logoE from "./EZPICS (converted)-03.png";
import { DesignEditorContext } from "../../../DesignEditorContext";
import { loadTemplateFonts } from "@/utils/media/fonts";
export default function Scenes({ hide }) {
  const scenes = useDesignEditorPages();
  const {
    setScenes,
    setCurrentScene,
    currentScene,
    setCurrentDesign,
    currentDesign,
  } = React.useContext(DesignEditorContext);
  const [loading, setLoading] = React.useState(false);

  const editor = useEditor();
  const [css] = useStyletron();
  const [currentPreview, setCurrentPreview] = React.useState("");

  React.useEffect(() => {
    if (editor && scenes && currentScene) {
      const isCurrentSceneLoaded = scenes.find(
        (s) => s.id === currentScene?.id
      );
      if (!isCurrentSceneLoaded) {
        setCurrentScene(scenes[0]);
      }
    }
  }, [editor, scenes, currentScene]);
  const [hoveredPage, setHoveredPage] = React.useState(null);

  React.useEffect(() => {
    let watcher = async () => {
      const updatedTemplate = editor.scene.exportToJSON();
      const updatedPreview = (await editor.renderer.render(
        updatedTemplate
      )) as string;
      setCurrentPreview(updatedPreview);
    };
    if (editor) {
      editor.on("history:changed", watcher);
    }
    return () => {
      if (editor) {
        editor.off("history:changed", watcher);
      }
    };
  }, [editor]);

  React.useEffect(() => {
    if (editor) {
      if (currentScene) {
        updateCurrentScene(currentScene);
      } else {
        const defaultTemplate = getDefaultTemplate({
          width: 1200,
          height: 800,
        });
        setCurrentDesign({
          id: nanoid(),
          frame: defaultTemplate.frame,
          metadata: {},
          name: "Untitled Design",
          preview: "",
          scenes: [],
          type: "GRAPHIC",
        });
        editor.scene
          .importFromJSON(defaultTemplate)
          .then(() => {
            const initialDesign = editor.scene.exportToJSON() as any;
            editor.renderer.render(initialDesign).then((data) => {
              setCurrentScene({ ...initialDesign, preview: data });
              setScenes([{ ...initialDesign, preview: data }]);
              console.log(data);
            });
          })
          .catch(console.log);
      }
    }
  }, [editor, currentScene]);

  const updateCurrentScene = React.useCallback(
    async (design: IScene) => {
      await editor.scene.importFromJSON(design);
      const updatedPreview = (await editor.renderer.render(design)) as string;
      setCurrentPreview(updatedPreview);
    },
    [editor, currentScene]
  );
  const loadGraphicTemplate = async (payload: any) => {
    const scenes = [];
    const { scenes: scns, ...design } = payload;
    for (const scn of scns) {
      console.log(scns);

      const scene: IScene = {
        name: payload.name,
        frame: payload.frame,
        id: payload.id,
        layers: scn.layers,
        metadata: {},
      };
      console.log("scns" + scene);

      const loadedScene = await loadVideoEditorAssets(scene);
      await loadTemplateFonts(loadedScene);

      const preview = (await editor.renderer.render(loadedScene)) as string;
      scenes.push({ ...loadedScene, preview });
    }

    return { scenes, design };
  };
  const addScene = React.useCallback(async () => {
    setCurrentPreview("");

    const updatedTemplate = editor.scene.exportToJSON();
    const updatedPreview = await editor.renderer.render(updatedTemplate);

    const updatedPages = scenes.map((p) => {
      if (p.id === updatedTemplate.id) {
        return { ...updatedTemplate, preview: updatedPreview };
      }
      return p;
    });

    const defaultTemplate = getDefaultTemplate(currentDesign.frame);
    const newPreview = await editor.renderer.render(defaultTemplate);
    const newPage = {
      ...defaultTemplate,
      id: nanoid(),
      preview: newPreview,
    } as any;
    const newPages = [...updatedPages, newPage] as any[];

    setScenes(newPages);
    setCurrentScene(newPage);
    console.log(currentScene);
  }, [scenes, currentDesign]);
  const handleImportTemplate = React.useCallback(
    async (data: any) => {
      let template;

      template = await loadGraphicTemplate(data);

      //   @ts-ignore
      setScenes(template.scenes);
      //   @ts-ignore
      setCurrentDesign(template.design);
    },
    [editor]
  );
  const token = useAppSelector((state) => state?.token?.token);
  function findIndexById(arr: any, targetId: any) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].id === targetId) {
        return i;
      }
    }
    return -1; // Trả về -1 nếu không tìm thấy
  }
  const parseGraphicJSON = () => {
    const currentScene = editor.scene.exportToJSON();

    console.log(currentScene);
    const updatedScenes = scenes.map((scn) => {
      if (scn.id === currentScene.id) {
        return {
          id: currentScene.id,
          layers: currentScene.layers,
          name: currentScene.name,
        };
      }
      return {
        id: scn.id,
        layers: scn.layers,
        name: scn.name,
      };
    });

    if (currentDesign) {
      const graphicTemplate: any = {
        id: currentDesign.id,
        type: "GRAPHIC",
        name: currentDesign.name,
        frame: currentDesign.frame,
        scenes: updatedScenes,
        metadata: {},
        preview: "",
      };

      let resultIndex = findIndexById(graphicTemplate.scenes, currentScene.id);
      console.log(resultIndex);

      return resultIndex;
    } else {
      console.log("NO CURRENT DESIGN");
    }
  };
  function checkTokenCookie() {
    var allCookies = document.cookie;

    var cookiesArray = allCookies.split("; ");

    var tokenCookie;
    for (var i = 0; i < cookiesArray.length; i++) {
      var cookie = cookiesArray[i];
      var cookieParts = cookie.split("=");
      var cookieName = cookieParts[0];
      var cookieValue = cookieParts[1];

      if (cookieName === "token") {
        tokenCookie = cookieValue;
        break;
      }
    }

    // Kiểm tra nếu đã tìm thấy cookie "token"
    if (tokenCookie) {
      console.log('Giá trị của cookie "token" là:', tokenCookie);
      return tokenCookie.replace(/^"|"$/g, "");
    } else {
      console.log('Không tìm thấy cookie có tên là "token"');
    }
  }
  const network = useAppSelector((state) => state?.network?.ipv4Address);
  const idProduct = useAppSelector((state) => state?.token?.id);
  function findAndSetIndex(pageIdToDelete: any) {
    return scenes.findIndex((scene) => scene.id === pageIdToDelete.id);
  }
  const handleDelete = React.useCallback(
    async (e: any, pageIdToDelete: any) => {
      e.stopPropagation();
      // setLoading(true);
      // setCurrentPreview(""); // Assuming setCurrentPreview is a state updater function

      const updatedTemplate = editor.scene.exportToJSON();
      const updatedPreview = await editor.renderer.render(updatedTemplate);

      const updatedPages = scenes.map((p) => {
        if (p.id === updatedTemplate.id) {
          return { ...updatedTemplate, preview: updatedPreview };
        }
        return p;
      });

      const newPages = scenes.map((p) => {
        return p.id === updatedTemplate.id
          ? { ...updatedTemplate, preview: updatedPreview }
          : p;
      });

      const otherPage = newPages.filter((p) => {
        return p.id !== pageIdToDelete.id;
      });
      const newPagess = [...otherPage] as any[];

      console.log(newPagess);

      const designer = {
        frame: { width: 1080, height: 1920 },
        id: "ZYYkWRWKCB2EwIdp-f1Iw",
        metadata: {},
        name: "Untitled Design",
        preview: "",
        scenes: newPagess,
        type: "GRAPHIC",
      };

      const res = await axios.post(`${network}/deletePageLayerAPI`, {
        idProduct: idProduct,
        page: findAndSetIndex(pageIdToDelete),
        token: checkTokenCookie(),
      });
      if (res.data.code === 0) {
        setScenes(newPagess);
        setCurrentDesign(designer);
        setCurrentScene(newPagess[0]);
        setTimeout(() => {
          setLoading(false);
          toast("Xóa thành công !! 🦄", {
            position: "top-left",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        }, 1000);
      }
    },
    [scenes, currentDesign]
  );

  const handleAdd = () => {
    toast("Tính năng này đang được cập nhật, hãy chờ nhé !! 🦄", {
      position: "top-left",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  };

  const changePage = React.useCallback(
    async (page: any) => {
      setCurrentPreview("");
      if (editor) {
        const updatedTemplate = editor.scene.exportToJSON();
        const updatedPreview = await editor.renderer.render(updatedTemplate);

        const updatedPages = scenes.map((p) => {
          if (p.id === updatedTemplate.id) {
            return { ...updatedTemplate, preview: updatedPreview };
          }
          return p;
        }) as any[];

        setScenes(updatedPages);
        setCurrentScene(page);
      }
    },
    [editor, scenes, currentScene]
  );

  return (
    <>
      {
        <Block
          $style={{
            padding: "0.25rem 0.75rem",
            background: "#ffffff",
            // display:  hide ? 'block' : 'none',
            display: hide ? "block" : "none",
          }}
        >
          <Block $style={{ display: "flex", alignItems: "center" }}>
            {scenes.map((page: any, index: any) => (
              <div
                style={{
                  background:
                    page.id === currentScene?.id
                      ? "rgb(243,244,246)"
                      : "#ffffff",
                  padding: "1rem 0.5rem",
                }}
                key={index}
                onMouseEnter={() => setHoveredPage(page)}
                onMouseLeave={() => setHoveredPage(null)}
              >
                <div
                  onClick={() => changePage(page)}
                  className={css({
                    cursor: "pointer",
                    position: "relative",
                    border:
                      page.id === currentScene?.id
                        ? "2px solid #7158e2"
                        : "2px solid rgba(0,0,0,.15)",
                  })}
                >
                  <img
                    style={{
                      maxWidth: "90px",
                      maxHeight: "80px",
                      display: "flex",
                    }}
                    src={
                      currentPreview && page.id === currentScene?.id
                        ? currentPreview
                        : page.preview
                    }
                  />
                  {hoveredPage === page && (
                    <div
                      onClick={(e) => handleDelete(e, page)} // Add your delete logic here
                      className={css({
                        position: "absolute",
                        top: "4px",
                        right: "4px",
                        background: "rgba(255,0,0,0.7)",
                        color: "#fff",
                        fontSize: "16px",
                        borderRadius: "50%",
                        height: "24px",
                        width: "24px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                      })}
                    >
                      <FaTrash />
                    </div>
                  )}
                  <div
                    className={css({
                      position: "absolute",
                      bottom: "4px",
                      right: "4px",
                      background: "rgba(0,0,0,0.4)",
                      color: "#fff",
                      fontSize: "10px",
                      borderRadius: "2px",
                      height: "16px",
                      width: "16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    })}
                  >
                    {index + 1}
                  </div>
                </div>
              </div>
            ))}
            <div
              style={{
                background: "#ffffff",
                padding: "1rem 1rem 1rem 0.5rem",
              }}
            >
              <div
                onClick={addScene}
                // onClick={handleAdd}
                className={css({
                  width: "100px",
                  height: "56px",
                  background: "rgb(243,244,246)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                })}
              >
                <Add size={20} />
              </div>
            </div>
          </Block>
        </Block>
      }

      {loading && (
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.7)",
            position: "fixed",
            zIndex: 20000000000,
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
          }}
        >
          <div className="loadingio-spinner-dual-ring-hz44svgc0ld">
            <div className="ldio-4qpid53rus9">
              <div></div>
              <div>
                <div></div>
              </div>
            </div>
            <img
              style={{
                position: "absolute",
                top: "12%",
                left: "16%",
                width: 40,
                height: 40,
              }}
              src={logoE}
            />
          </div>
        </div>
      )}
    </>
  );
}
