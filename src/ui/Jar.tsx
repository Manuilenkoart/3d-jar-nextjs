"use client";

import { fetcher, fetchWidgetJarInfo } from "@/lib/hooks";
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
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  ChangeEvent,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { StatusBar } from "@/ui/StatusBar";

import Menu from "@mui/icons-material/Menu";
import {
  Box,
  Button,
  Checkbox,
  Drawer,
  Fab,
  FormControlLabel,
  IconButton,
  Slider,
  Stack,
  TextField,
} from "@mui/material";
import { Panel } from "./components";
import { Picker } from "./Picker";
import { inter } from "@/lib/fonts";
import { TJar } from "@/lib/definitions";
import {
  ANIMATION_DURATION_CONFIGURATION,
  ANIMATIONS,
  COOKIE_KEYS,
  LOCAL_STORAGE_KEYS,
  SEARCH_PARAMS,
  RE_FETCH_INTERVAL,
  UTM,
} from "@/lib/constants";
import CloseIcon from "@mui/icons-material/Close";
import useSWR from "swr";

type Props = {
  clientId: string;
};
function Jar({ clientId }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [animationIndex, setAnimationIndex] = useState(ANIMATIONS.idle);

  const [isVisibleSidebar, setIsVisibleSidebar] = useState(false);

  const {
    data: mainJarInfo,
    error: mainJarInfoError,
    isLoading: mainJarInfoIsLoading,
  } = useSWR<TJar>(`/api/jar?clientId=${clientId}`, fetcher, {
    revalidateOnFocus: false,
  });

  const [newJarAmount, setNewJarAmount] = useState(0);
  const [jarData, setJarData] = useState<TJar>({
    description: "",
    extJarId: "",
    jarAmount: 0,
    jarGoal: 0,
    name: "",
  });

  const [isLoading, setIsLoading] = useState(mainJarInfoIsLoading);
  const [fetchError, setFetchError] = useState(mainJarInfoError);

  const [inputJarId, setInputJarId] = useState(clientId);

  const isWidgetMode =
    searchParams.get(SEARCH_PARAMS.utmContent) === UTM.content.isWidgetMode;

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

  const [hasAvatarShadow, setHasAvatarShadow] = useState(true);

  useEffect(() => {
    const param = searchParams.get(SEARCH_PARAMS.hasAvatarShadow);
    const storage = read(LOCAL_STORAGE_KEYS.hasAvatarShadow);

    const hasAvatarShadowStorage = param
      ? JSON.parse(param)
      : (storage ?? true);

    if (hasAvatarShadow !== hasAvatarShadowStorage) {
      setHasAvatarShadow(hasAvatarShadowStorage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const debounceAnimation = debounce(
    setAnimationIndex,
    1000 * animationDuration,
  );

  useEffect(() => {
    const { jarAmount } = jarData;

    if (jarAmount > newJarAmount) {
      setAnimationIndex(ANIMATIONS.dance);
      setNewJarAmount(jarAmount);

      debounceAnimation(ANIMATIONS.idle);
    }
  }, [debounceAnimation, jarData, newJarAmount]);

  const checkResponse = useCallback(
    (jar: TJar) => {
      const keys = Object.keys(jar);

      if (
        ["description", "jarGoal", "jarAmount", "name"].every((k) =>
          keys.includes(k),
        )
      ) {
        setJarData((prev) => ({ ...prev, ...jar }));
        return;
      }

      if (keys.includes("errCode")) {
        if (jar.errCode === "7014") {
          setFetchError("Схоже, банки з таким ID не існує");
          setIsVisibleSidebar(true);
          console.error(`${clientId}: errCode - 7014`);
          return;
        }
        if (jar.errCode === "TMR") {
          setFetchError("Забагато запитів. Спробуйте пізніше.");
          console.error(`${clientId}: errCode - TMR`);

          return;
        }
      }
    },
    [clientId],
  );

  useEffect(() => {
    if (mainJarInfo) return checkResponse(mainJarInfo);

    setIsLoading(false);
  }, [mainJarInfo, checkResponse]);

  const makefetchJarData = useCallback(async () => {
    setIsLoading(true);
    try {
      if (!jarData.extJarId) return;

      const data = await fetchWidgetJarInfo(jarData.extJarId);
      checkResponse(data);
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  }, [jarData.extJarId, checkResponse]);

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
        { name: SEARCH_PARAMS.hasAvatarShadow, value: hasAvatarShadow },
      ]
        .map(
          ({ name, value }, idx) =>
            `${idx === 0 ? `?${SEARCH_PARAMS.utmContent}=${UTM.content.isWidgetMode}&` : "&"}${name}=${value}`,
        )
        .join(""),
    [
      animationDuration,
      bcColor,
      hasAvatarShadow,
      interfaceFontColor,
      isShowText,
      isTransparent,
    ],
  );

  const handleHideSideBar = useCallback(() => {
    setIsVisibleSidebar(false);

    write(LOCAL_STORAGE_KEYS.avatarAnimationDuration, animationDuration);
    write(LOCAL_STORAGE_KEYS.bcColor, bcColor);
    write(LOCAL_STORAGE_KEYS.bcColorIsTransparent, isTransparent);
    write(LOCAL_STORAGE_KEYS.isShowText, isShowText);
    write(LOCAL_STORAGE_KEYS.hasAvatarShadow, hasAvatarShadow);

    if (clientId !== inputJarId) {
      setCookie(COOKIE_KEYS.jarId, inputJarId);

      router.push(`/jars/${inputJarId}`);
    }
  }, [
    animationDuration,
    bcColor,
    isTransparent,
    isShowText,
    hasAvatarShadow,
    clientId,
    inputJarId,
    router,
  ]);

  const handleIsShowInterfaceText = useCallback(() => {
    setIsShowText((p) => !p);
  }, []);

  const handleAvatarShadow = useCallback(() => {
    setHasAvatarShadow((p) => !p);
  }, []);

  const windowLocationOrigin = useMemo(() => getWindowLocationOrigin(), []);

  const { name, description, jarAmount, jarGoal } = useMemo(
    () => jarData,
    [jarData],
  );

  return (
    <div style={{ backgroundColor: isTransparent ? "transparent" : bcColor }}>
      {isWidgetMode ? null : (
        <Button
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 1,
          }}
          color="inherit"
          startIcon={<Menu />}
          variant="text"
          onClick={() => setIsVisibleSidebar(true)}
        />
      )}

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
            <IconButton aria-label="close" onClick={() => handleHideSideBar()}>
              <CloseIcon />
            </IconButton>
          </Stack>

          <Panel title="Поточний збір">
            <>
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

                <Fab
                  color="primary"
                  disabled={inputJarId.length < 7}
                  onClick={() => handleHideSideBar()}
                >
                  GO
                </Fab>
              </Stack>
              <Box color={"red"}>{fetchError}</Box>
            </>
          </Panel>

          <Panel title="Interface">
            <Box sx={{ display: "grid", gap: "12px" }}>
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
                  label="Background transparent"
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

              <FormControlLabel
                control={
                  <Checkbox
                    checked={hasAvatarShadow}
                    onChange={handleAvatarShadow}
                  />
                }
                label="Show shadow"
              />
            </Box>
          </Panel>

          <Panel
            title="Streaming link"
            actions={
              <Button
                variant="outlined"
                onClick={() =>
                  navigator.clipboard.writeText(
                    windowLocationOrigin + pathname + makeSearchParams,
                  )
                }
              >
                copy
              </Button>
            }
          >
            <Box sx={{ maxWidth: "500px" }}>
              <p>{windowLocationOrigin + pathname + makeSearchParams}</p>
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
            isCastShadow={hasAvatarShadow}
            position={[0, 0, 0]}
            animationIndex={animationIndex}
          />
        </Scene>

        {isShowText ? (
          <Footer {...{ description, interfaceFontColor }} />
        ) : null}

        {isWidgetMode ? null : (
          <StatusBar {...{ isLoading, jarAmount, jarGoal, fetchError }} />
        )}
      </div>
    </div>
  );
}
export default memo(Jar);
