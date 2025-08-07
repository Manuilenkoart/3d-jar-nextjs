"use client";

import { fetchWidgetJarInfo } from "@/lib/hooks";
import {
  write,
  read,
  debounce,
  setCookie,
  getWindowLocationOrigin,
} from "@/lib/utils";
import { Footer } from "@/ui/Footer";
import { Header } from "@/ui/Header";
import { Model } from "@/ui/Model";
import { Scene } from "@/ui/Scene";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import { StatusBar } from "@/ui/StatusBar";

import Menu from "@mui/icons-material/Menu";
import {
  Box,
  Button,
  Checkbox,
  Drawer,
  FormControlLabel,
  IconButton,
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
  SEARCH_PARAMS,
  RE_FETCH_INTERVAL,
} from "@/lib/constants";
import CloseIcon from "@mui/icons-material/Close";

type Props = {
  mainJarInfo: Jar;
};
export default function Jar({
  mainJarInfo: { extJarId, ...restMainJarInfo },
}: Props) {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [animationIndex, setAnimationIndex] = useState(ANIMATIONS.idle);

  const [isVisibleSidebar, setIsVisibleSidebar] = useState(false);

  const [newJarAmount, setNewJarAmount] = useState(0);
  const [jarData, setJarData] = useState(() => restMainJarInfo);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");

  const [inputJarId, setInputJarId] = useState(() => params.id);

  const [isShowText, setIsShowText] = useState<boolean>(() => {
    const param = searchParams.get(SEARCH_PARAMS.isShowText);
    const storage = read(LOCAL_STORAGE_KEYS.isShowText);

    return param ? (JSON.parse(param) as boolean) : (storage ?? true);
  });

  const [interfaceFontColor, setInterfaceFontColor] = useState(() => {
    const param = searchParams.get(SEARCH_PARAMS.fontColor);
    const storage = read(LOCAL_STORAGE_KEYS.fontColor);

    const color = param ? `#${param}` : null;

    return color ?? storage ?? "#000000";
  });

  const [isTransparent, setIsTransparent] = useState(true);

  useEffect(() => {
    const param = searchParams.get(SEARCH_PARAMS.isTranparent);
    const storage = read(LOCAL_STORAGE_KEYS.bcColorIsTransparent);

    const isTransparentStorage = param ? JSON.parse(param) : (storage ?? true);

    if (isTransparent !== isTransparentStorage) {
      setIsTransparent(isTransparentStorage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [bcColor, setBcColor] = useState(() => {
    const param = searchParams.get(SEARCH_PARAMS.bcColor);
    const storage = read(LOCAL_STORAGE_KEYS.bcColor);

    const color = param ? `#${param}` : null;

    return color ?? storage ?? "#ffffff";
  });

  const [animationDuration, setAnimationDuration] = useState(() => {
    const param = searchParams.get(SEARCH_PARAMS.animationDuration);
    const storage = read(LOCAL_STORAGE_KEYS.avatarAnimationDuration);

    //TODO: check is values in min-max ANIMATION_DURATION_CONFIGURATION range
    const paramNormalized = param ? +param : null;
    const storageNormalized = storage ? +storage : null;

    return (
      paramNormalized ||
      storageNormalized ||
      ANIMATION_DURATION_CONFIGURATION.max
    );
  });

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

  const makeSearchParams = useMemo(
    () =>
      [
        { name: SEARCH_PARAMS.isTranparent, value: isTransparent },
        { name: SEARCH_PARAMS.isShowText, value: isShowText },
        { name: SEARCH_PARAMS.fontColor, value: interfaceFontColor.slice(1) },
        { name: SEARCH_PARAMS.bcColor, value: bcColor.slice(1) },
        { name: SEARCH_PARAMS.animationDuration, value: animationDuration },
      ]
        .map(
          ({ name, value }, idx) => `${idx === 0 ? "?" : "&"}${name}=${value}`
        )
        .join(""),
    [animationDuration, bcColor, interfaceFontColor, isShowText, isTransparent]
  );

  const handleHideSideBar = useCallback(() => {
    setIsVisibleSidebar(false);

    write(LOCAL_STORAGE_KEYS.avatarAnimationDuration, animationDuration);
    write(LOCAL_STORAGE_KEYS.bcColor, bcColor);
    write(LOCAL_STORAGE_KEYS.bcColorIsTransparent, isTransparent);
    write(LOCAL_STORAGE_KEYS.isShowText, isShowText);

    if (params && params.id !== inputJarId) {
      setCookie(COOKIE_KEYS.jarId, inputJarId);

      router.push(`/jars/${inputJarId}`);
    }
  }, [
    animationDuration,
    bcColor,
    isTransparent,
    isShowText,
    params,
    inputJarId,
    router,
  ]);

  const handleIsShowInterfaceText = useCallback(() => {
    setIsShowText((p) => !p);
  }, []);

  const windowLocationOrigin = useMemo(() => getWindowLocationOrigin(), []);

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
          spacing={3}
          sx={{ padding: "16px 8px" }}
          className={inter.className}
        >
          <Stack
            direction="row"
            sx={{
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h2>Налаштування</h2>
            <IconButton aria-label="close">
              <CloseIcon />
            </IconButton>
          </Stack>

          <Panel title="Поточний збір">
            <Stack
              direction="row"
              sx={{
                alignItems: "center",
                gap: "16px",
              }}
            >
              <Stack
                direction="row"
                sx={{
                  alignItems: "center",
                }}
              >
                <p>https://send.monobank.ua/jar/</p>
                <TextField
                  id="outlined-basic"
                  label="jar id"
                  variant="outlined"
                  value={inputJarId}
                  onChange={(e) => setInputJarId(e.target.value)}
                />
              </Stack>

              <Button
                variant="contained"
                sx={{
                  borderRadius: "50%",
                  minWidth: "10px",
                  padding: "10px",
                }}
                disabled={inputJarId.length < 7}
                onClick={() => handleHideSideBar()}
              >
                GO
              </Button>
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
                    onClick={handleIsShowInterfaceText}
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

          <Panel title="Streaming link">
            <Box sx={{ maxWidth: "500px" }}>
              {windowLocationOrigin + pathname + makeSearchParams}
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
