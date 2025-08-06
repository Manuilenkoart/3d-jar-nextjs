"use client";

import { fetchWidgetJarInfo } from "@/lib/hooks";
import { write, read, debounce, setCookie } from "@/lib/utils";
import { Footer } from "@/ui/Footer";
import { Header } from "@/ui/Header";
import { Model } from "@/ui/Model";
import { Scene } from "@/ui/Scene";
import { useParams, useRouter } from "next/navigation";

import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import { StatusBar } from "@/ui/StatusBar";

import Menu from "@mui/icons-material/Menu";
import {
  Box,
  Button,
  Checkbox,
  Drawer,
  FormControlLabel,
  Slider,
  Stack,
  TextField,
} from "@mui/material";
import { Panel } from "./components";
import { Picker } from "./Picker";
import { inter } from "@/lib/fonts";
import { type Jar } from "@/lib/definitions";
import {
  ANIMATION_DURATION_CONFIGURATION,
  ANIMATIONS,
  COOKIE_KEYS,
  LOCAL_STORAGE_KEYS,
  RE_FETCH_INTERVAL,
} from "@/lib/constants";

type Props = {
  mainJarInfo: Jar;
};
export default function Jar({
  mainJarInfo: { extJarId, ...restMainJarInfo },
}: Props) {
  const params = useParams<{ id: string }>();

  const [animationIndex, setAnimationIndex] = useState(ANIMATIONS.idle);

  const [isVisibleSidebar, setIsVisibleSidebar] = useState(false);
  const [isShowText, setIsShowText] = useState(true);

  const [newJarAmount, setNewJarAmount] = useState(0);
  const [jarData, setJarData] = useState(() => restMainJarInfo);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");

  const [inputJarId, setInputJarId] = useState(() => params.id);

  const [interfaceFontColor, setInterfaceFontColor] = useState(
    () => read(LOCAL_STORAGE_KEYS.fontColor) ?? "#000000"
  );
  const [isTransparent, setIsTransparent] = useState(true);

  useEffect(() => {
    const isTransparentStorage = read(LOCAL_STORAGE_KEYS.bcColorIsTransparent);

    if (isTransparent !== isTransparentStorage) {
      setIsTransparent(isTransparentStorage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [bcColor, setBcColor] = useState("#ffffff");

  useEffect(() => {
    const backgroundColor = read(LOCAL_STORAGE_KEYS.bcColor);
    if (backgroundColor && backgroundColor !== bcColor) {
      setBcColor(backgroundColor);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [animationDuration, setAnimationDuration] = useState(
    () =>
      read(LOCAL_STORAGE_KEYS.avatarAnimationDuration) ??
      ANIMATION_DURATION_CONFIGURATION.min
  );

  const debounceAnimation = debounce(
    setAnimationIndex,
    1000 * animationDuration
  );

  useEffect(() => {
    const { jarAmount } = jarData;

    if (jarAmount > newJarAmount) {
      setAnimationIndex(ANIMATIONS.dance);
      setNewJarAmount(jarAmount);

      debounceAnimation(ANIMATIONS.idle);
    }
  }, [debounceAnimation, jarData, newJarAmount]);

  const makefetchJarData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchWidgetJarInfo(extJarId);
      setJarData((prev) => ({ ...prev, ...data }));
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  }, [extJarId]);

  useEffect(() => {
    const intervalId = setInterval(makefetchJarData, 1000 * RE_FETCH_INTERVAL);

    return () => clearInterval(intervalId);
  }, [makefetchJarData]);

  const handleInterfaceFontColor = useCallback((color: string) => {
    setInterfaceFontColor(color);
    write(LOCAL_STORAGE_KEYS.fontColor, color);
  }, []);

  const handlePickerBcColor = useCallback((color: string) => {
    setIsTransparent(false);
    setBcColor(color);
  }, []);

  const handleTransparent = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;

    setIsTransparent(isChecked);
  }, []);

  const router = useRouter();

  const handleHideSideBar = useCallback(() => {
    setIsVisibleSidebar(false);

    write(LOCAL_STORAGE_KEYS.avatarAnimationDuration, animationDuration);
    write(LOCAL_STORAGE_KEYS.bcColor, bcColor);
    write(LOCAL_STORAGE_KEYS.bcColorIsTransparent, isTransparent);

    if (params && params.id !== inputJarId) {
      setCookie(COOKIE_KEYS.jarId, inputJarId);

      router.push(`/jars/${inputJarId}`);
    }
  }, [animationDuration, bcColor, isTransparent, params, inputJarId, router]);

  const { name, description, jarAmount, jarGoal } = useMemo(
    () => jarData,
    [jarData]
  );

  return (
    <div style={{ backgroundColor: isTransparent ? "transparent" : bcColor }}>
      <Button
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 1,
        }}
        startIcon={<Menu />}
        variant="text"
        onClick={() => setIsVisibleSidebar(true)}
      />

      <Drawer open={isVisibleSidebar} onClose={handleHideSideBar}>
        <Stack
          spacing={2}
          sx={{ padding: "16px 8px" }}
          className={inter.className}
        >
          <Panel title="Current jar">
            <Stack
              direction="row"
              sx={{
                alignItems: "center",
              }}
            >
              https://send.monobank.ua/jar/
              <TextField
                id="outlined-basic"
                label="jar id"
                variant="outlined"
                value={inputJarId}
                onChange={(e) => setInputJarId(e.target.value)}
              />
            </Stack>
          </Panel>

          <Panel title="Interface">
            <Box sx={{ display: "grid", gap: "16px" }}>
              <Box
                sx={{
                  display: "flex",
                  gap: "8px",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Picker
                  title="Background color"
                  value={bcColor}
                  onChange={handlePickerBcColor}
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isTransparent}
                      onChange={handleTransparent}
                    />
                  }
                  label="transparent"
                />
              </Box>

              {jarAmount && jarGoal ? (
                <>
                  <Picker
                    title="Font color"
                    value={interfaceFontColor}
                    onChange={handleInterfaceFontColor}
                  />

                  <Button
                    variant="outlined"
                    onClick={() => setIsShowText((p) => !p)}
                  >
                    {`${isShowText ? "Hide" : "Show"} interface text`}
                  </Button>
                </>
              ) : null}
            </Box>
          </Panel>

          <Panel title="Avatar">
            <Box sx={{ display: "grid", gap: "16px" }}>
              <Box sx={{ display: "flex", gap: "16px", alignItems: "center" }}>
                <Box sx={{ flex: 1 }}>
                  Animation duration: {animationDuration}s
                </Box>
                <Slider
                  sx={{ flex: 1 }}
                  value={animationDuration}
                  onChange={(_e, newValue) => setAnimationDuration(newValue)}
                  min={ANIMATION_DURATION_CONFIGURATION.min}
                  max={ANIMATION_DURATION_CONFIGURATION.max}
                />
              </Box>
            </Box>
          </Panel>
        </Stack>
      </Drawer>

      <div
        style={{
          display: "grid",
          height: "100vh",
        }}
      >
        {isShowText ? (
          <Header
            {...{
              jarGoal,
              jarAmount,
              name,
              interfaceFontColor,
            }}
          />
        ) : null}

        <Scene>
          <Model
            castShadow
            position={[0, 0, 0]}
            animationIndex={animationIndex}
          />
        </Scene>

        {isShowText ? (
          <Footer {...{ description, interfaceFontColor }} />
        ) : null}

        <StatusBar {...{ isLoading, jarAmount, jarGoal, fetchError }} />
      </div>
    </div>
  );
}
