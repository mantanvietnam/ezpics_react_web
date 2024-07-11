"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useEditor } from "@layerhub-io/react";
import { Block } from "baseui/block";
import Scrollable from "@/components/Scrollable";
import AngleDoubleLeft from "@/components/Icons/AngleDoubleLeft";
import { useStyletron } from "baseui";
import useSetIsSidebarOpen from "@/hooks/useSetIsSidebarOpen";
import useDesignEditorContext from "@/hooks/useDesignEditorContext";
import axios from "axios";
import { useAppSelector } from "@/hooks/hook";
import useAppContext from "@/hooks/useAppContext";
import "../../Preview/newloading.css";
import NextImage from "next/image";
import ezlogo from "./EZPICS (converted)-03.png";
import Image from "next/image";
interface Category {
  id: string;
  name: string;
}

interface Item {
  id: string;
  category_id: string;
  image: string;
}

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

  if (tokenCookie) {
    return tokenCookie.replace(/^"|"$/g, "");
  } else {
  }
}

export default function Graphic() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const network = useAppSelector((state) => state.network.ipv4Address);
  const { setActiveSubMenu } = useAppContext();
  const editor = useEditor();
  const setIsSidebarOpen = useSetIsSidebarOpen();
  const {
    setCurrentScene,
    currentScene,
    setDisplayPreview,
    setScenes,
    setCurrentDesign,
    currentDesign,
    scenes,
  } = useDesignEditorContext();
  const idProduct = useAppSelector((state) => state.token.id);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await axios.get<any>(
          `${network}/categoryIngredientAPI`
        );
        setCategories(response.data.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }

    async function fetchAllItems() {
      setIsLoading(true);
      let allItems: Item[] = [];
      let page = 1;
      let hasMoreData = true;

      while (hasMoreData) {
        try {
          const response = await axios.post<any>(
            `${network}/listIngredientAPI`,
            {
              token: checkTokenCookie(),
              limit: 100,
              page: page,
            }
          );
          const fetchedItems = response.data.data;
          if (fetchedItems.length > 0) {
            allItems = [...allItems, ...fetchedItems];
            page++;
          } else {
            hasMoreData = false;
          }
        } catch (error) {
          console.error("Error fetching items:", error);
          hasMoreData = false;
        }
      }

      setItems(allItems);
      setIsLoading(false);
    }

    fetchCategories();
    fetchAllItems();
  }, [network]);

  const addObject = useCallback(
    (url: string) => {
      if (editor) {
        const img = new Image();
        img.src = url;
        img.onload = function () {
          const options = {
            type: "StaticImage",
            src: url,
            width: img.naturalWidth,
            height: img.naturalHeight,
            lock: false,
          };
          editor.objects.add(options);
        };
      }
    },
    [editor]
  );

  const parseGraphicJSON = () => {
    const currentSceneJSON = editor.scene.exportToJSON();
    const updatedScenes = scenes.map((scn) =>
      scn.id === currentSceneJSON.id
        ? {
            ...scn,
            layers: currentSceneJSON.layers,
            name: currentSceneJSON.name,
          }
        : scn
    );
    if (currentDesign) {
      return updatedScenes.findIndex(
        (scene) => scene.id === currentSceneJSON.id
      );
    }
  };

  const handleImage = async (item: Item) => {
    try {
      const response = await axios.post(`${network}/addLayerImageUrlAPI`, {
        idproduct: idProduct,
        token: checkTokenCookie(),
        imageUrl: item.image,
        page: parseGraphicJSON(),
      });
      if (response.data.code === 1) {
        const content = response.data.data.content;
        const options = {
          type: "StaticImage",
          src: content.banner,
          id: response.data.data.id,
          metadata: {
            brightness: 20,
            naturalWidth: content.naturalWidth,
            naturalHeight: content.naturalHeight,
            initialHeight: content.height,
            initialWidth: content.width,
            lock: false,
            variable: content.variable,
            variableLabel: content.variableLabel,
            page: Number(content.page),
          },
        };
        editor.objects.add(options);
      }
    } catch (error) {
      console.error("Error handling image:", error);
    }
  };

  return (
    <>
      <Block $style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Block
          $style={{
            display: "flex",
            alignItems: "center",
            fontWeight: 500,
            justifyContent: "space-between",
            padding: "0 1.5rem",
          }}
        >
          <h4 style={{ fontFamily: "Helvetica, Arial, sans-serif" }}>
            Thành phần
          </h4>
          <Block
            onClick={() => setIsSidebarOpen(false)}
            $style={{ cursor: "pointer", display: "flex" }}
          >
            <AngleDoubleLeft size={18} />
          </Block>
        </Block>
        <Scrollable>
          <div style={{ padding: "0 1.5rem" }}>
            {categories.map((category) => (
              <CategorySection
                key={category.id}
                title={category.name}
                categoryId={category.id}
                items={items}
                handleImage={handleImage}
                setActiveSubMenu={setActiveSubMenu}
              />
            ))}
          </div>
        </Scrollable>
      </Block>
      {isLoading && <LoadingOverlay />}
    </>
  );
}

interface CategorySectionProps {
  title: string;
  categoryId: string;
  items: Item[];
  handleImage: (item: Item) => void;
  setActiveSubMenu: (title: string) => void;
}

function CategorySection({
  title,
  categoryId,
  items,
  handleImage,
  setActiveSubMenu,
}: CategorySectionProps) {
  const [showAll, setShowAll] = useState(false);
  const filteredItems = items.filter((item) => item.category_id === categoryId);

  const displayItems = showAll ? filteredItems : filteredItems.slice(0, 5);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 0",
        }}
      >
        <h4 style={{ fontFamily: "Helvetica, Arial, sans-serif" }}>{title}</h4>
        <button
          style={{
            border: 0,
            backgroundColor: "white",
            color: "rgb(0, 95, 198)",
            cursor: "pointer",
          }}
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? "Thu gọn" : "Xem thêm"}
        </button>
      </div>
      <div
        style={{
          display: "grid",
          gap: "0.5rem",
          gridTemplateColumns: "1fr 1fr",
        }}
      >
        {displayItems.map((item, index) => (
          <ImageItem
            key={index}
            preview={item.image}
            onClick={() => handleImage(item)}
          />
        ))}
      </div>
    </div>
  );
}

interface ImageItemProps {
  preview: string;
  onClick: () => void;
}

function ImageItem({ preview, onClick }: ImageItemProps) {
  const [css] = useStyletron();
  return (
    <div
      onClick={onClick}
      className={css({
        position: "relative",
        background: "#f8f8fb",
        cursor: "pointer",
        borderRadius: "8px",
        overflow: "hidden",
      })}
    >
      <div
        className={css({
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0,
          transition: "opacity 0.3s",
          ":hover": { opacity: 1 },
          backgroundImage:
            "linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.45) 100%)",
        })}
      />
      <img
        src={preview}
        className={css({ width: "100%", height: "100%", objectFit: "contain" })}
      />
    </div>
  );
}

function LoadingOverlay() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.7)",
        position: "absolute",
        zIndex: 20000000000,
      }}
    >
      <div className="loadingio-spinner-dual-ring-hz44svgc0ld">
        <div className="ldio-4qpid53rus9">
          <div></div>
          <div>
            <div></div>
          </div>
        </div>
        <Image
          style={{ position: "absolute", top: "12%", left: "16%" }}
          height={40}
          width={40}
          src={ezlogo}
          alt=""
        />
      </div>
    </div>
  );
}
