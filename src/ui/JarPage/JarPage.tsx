'use client';

import Menu from '@mui/icons-material/Menu';
import { Box, Button, Drawer, Stack } from '@mui/material';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ChangeEvent, memo, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';

import { ANIMATION_DURATION_CONFIGURATION, COOKIE_KEYS, LOCAL_STORAGE_KEYS, SEARCH_PARAMS, UTM } from '@/lib/constants';
import { Avatar, ProgressBarState, SceneEnvironment } from '@/lib/definitions';
import { inter } from '@/lib/fonts';
import { write, read, setCookie, getWindowLocationOrigin } from '@/lib/utils';
import { Scene } from '@/ui/Scene';
import { StatusBar } from '@/ui/StatusBar';

import { JarProgressBar, Qr } from '../components';
import {
  BenderComponent,
  MouseComponent,
  PumpkinComponent,
  QrCatComponent,
  SorceressComponent,
  ToyotaComponent,
} from '../models';

import {
  AvatarSettings,
  Footer,
  Header,
  InterfaceSettings,
  JarSettings,
  ProgressBarSettings,
  SidebarHeader,
  StreamingLinkSettings,
} from './components';
import { useAnimation, useJarData, useSearchParamState } from './hooks';

type Props = {
  clientId: string;
};

function JarPage({ clientId }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [model, setModel] = useState<Avatar>(
    () => searchParams.get(SEARCH_PARAMS.avatar) ?? read(LOCAL_STORAGE_KEYS.avatar) ?? 'pumpkin',
  );
  const [isVisibleSidebar, setIsVisibleSidebar] = useState(false);
  const [inputJarId, setInputJarId] = useState(clientId);

  const { jarData, isLoading, fetchError, setFetchError } = useJarData(clientId);

  const isWidgetMode = searchParams.get(SEARCH_PARAMS.utmContent) === UTM.content.isWidgetMode;

  const [isShowText, setIsShowText] = useSearchParamState(
    SEARCH_PARAMS.isShowText,
    LOCAL_STORAGE_KEYS.isShowText,
    true,
  );

  const [interfaceFontColor, setInterfaceFontColor] = useState('#000000');
  const [isTransparent, setIsTransparent] = useState(true);
  const [bcColor, setBcColor] = useState('#ffffff');
  const [animationDuration, setAnimationDuration] = useState(ANIMATION_DURATION_CONFIGURATION.max);
  const [hasAvatarShadow, setHasAvatarShadow] = useState(true);
  const [isShowQr, setIsShowQr] = useState(false);

  const [progressBar, setProgressBar] = useState<ProgressBarState>(() => ({
    isShow: false,
    isFixAmount: false,
    fixAmount: 0,
  }));

  const animationIndex = useAnimation(jarData, animationDuration);

  // Initialize states from search params and local storage
  useEffect(() => {
    const param = searchParams.get(SEARCH_PARAMS.fontColor);
    const storage = read(LOCAL_STORAGE_KEYS.fontColor);
    const color = param ? `#${param}` : null;
    setInterfaceFontColor(color ?? storage ?? '#000000');
  }, [searchParams]);

  useEffect(() => {
    const param = searchParams.get(SEARCH_PARAMS.isTranparent);
    const storage = read(LOCAL_STORAGE_KEYS.bcColorIsTransparent);
    const isTransparentStorage = param ? JSON.parse(param) : (storage ?? true);
    if (isTransparent !== isTransparentStorage) {
      setIsTransparent(isTransparentStorage);
    }
  }, []);

  useEffect(() => {
    const param = searchParams.get(SEARCH_PARAMS.bcColor);
    const storage = read(LOCAL_STORAGE_KEYS.bcColor);
    const color = param ? `#${param}` : null;
    setBcColor(color ?? storage ?? '#ffffff');
  }, [searchParams]);

  useEffect(() => {
    const param = searchParams.get(SEARCH_PARAMS.animationDuration);
    const storage = read(LOCAL_STORAGE_KEYS.avatarAnimationDuration);
    const paramNormalized = param ? +param : null;
    const storageNormalized = storage ? +storage : null;
    setAnimationDuration(paramNormalized || storageNormalized || ANIMATION_DURATION_CONFIGURATION.max);
  }, [searchParams]);

  useEffect(() => {
    const param = searchParams.get(SEARCH_PARAMS.hasAvatarShadow);
    const storage = read(LOCAL_STORAGE_KEYS.hasAvatarShadow);
    const hasAvatarShadowStorage = param ? JSON.parse(param) : (storage ?? true);
    if (hasAvatarShadow !== hasAvatarShadowStorage) {
      setHasAvatarShadow(hasAvatarShadowStorage);
    }
  }, []);

  useEffect(() => {
    const param = searchParams.get(SEARCH_PARAMS.isShowQr);
    const storage = read(LOCAL_STORAGE_KEYS.isShowQr);
    setIsShowQr(param ? JSON.parse(param) : (storage ?? false));
  }, [searchParams]);

  useEffect(() => {
    if (jarData.jarAmount && jarData.jarGoal) {
      const isShowParam =
        searchParams.get(SEARCH_PARAMS.progressBar.isShow) ?? read(LOCAL_STORAGE_KEYS.progressBar.isShow);
      const isFixAmountParam =
        searchParams.get(SEARCH_PARAMS.progressBar.isFixAmount) ?? read(LOCAL_STORAGE_KEYS.progressBar.isFixAmount);
      const fixAmountParam = searchParams.get(SEARCH_PARAMS.progressBar.fixAmount);

      const isShow = isShowParam ? JSON.parse(isShowParam) : false;
      const isFixAmount = isFixAmountParam ? JSON.parse(isFixAmountParam) : false;
      const fixAmount = fixAmountParam ? +fixAmountParam : (jarData.jarAmount ?? 0);

      setProgressBar({ isShow, isFixAmount, fixAmount });
    }
  }, [jarData, searchParams]);

  // Event handlers
  const handleInterfaceFontColor = useCallback((color: string) => {
    setInterfaceFontColor(color);
    write(LOCAL_STORAGE_KEYS.fontColor, color);
  }, []);

  const handlePickerBcColor = useCallback((color: string) => {
    setIsTransparent(false);
    setBcColor(color);
  }, []);

  const handleTransparent = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setIsTransparent(e.target.checked);
  }, []);

  const handleProgressBar = useCallback((value: boolean | number, field: keyof ProgressBarState) => {
    switch (field) {
      case 'isShow':
      case 'isFixAmount':
        setProgressBar((prev) => ({ ...prev, [field]: value }));
        break;
      case 'fixAmount':
        setProgressBar((prev) => ({
          ...prev,
          fixAmount: (value as number) * 100,
        }));
        break;
    }
  }, []);

  const handleIsShowQr = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setIsShowQr(e.target.checked);
  }, []);

  const handleIsShowInterfaceText = useCallback(() => {
    setIsShowText((p) => !p);
  }, [setIsShowText]);

  const handleAvatarShadow = useCallback(() => {
    setHasAvatarShadow((p) => !p);
  }, []);

  const handleChangeAvatar = useCallback((model: Avatar) => {
    setModel(model);
  }, []);

  const handleHideSideBar = useCallback(() => {
    setIsVisibleSidebar(false);

    // Save to local storage
    write(LOCAL_STORAGE_KEYS.avatarAnimationDuration, animationDuration);
    write(LOCAL_STORAGE_KEYS.bcColor, bcColor);
    write(LOCAL_STORAGE_KEYS.bcColorIsTransparent, isTransparent);
    write(LOCAL_STORAGE_KEYS.isShowText, isShowText);
    write(LOCAL_STORAGE_KEYS.hasAvatarShadow, hasAvatarShadow);
    write(LOCAL_STORAGE_KEYS.progressBar.isShow, progressBar.isShow);
    write(LOCAL_STORAGE_KEYS.progressBar.isFixAmount, progressBar.isFixAmount);
    write(LOCAL_STORAGE_KEYS.isShowQr, isShowQr);
    write(LOCAL_STORAGE_KEYS.avatar, model);

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
    progressBar,
    isShowQr,
    clientId,
    inputJarId,
    router,
    model,
  ]);

  const handleJarIdSubmit = useCallback(() => {
    if (fetchError) {
      setFetchError(null);
      setIsVisibleSidebar(true);
    }
    handleHideSideBar();
  }, [fetchError, setFetchError, handleHideSideBar]);

  // Computed values
  const makeSearchParams = useMemo(
    () =>
      [
        { name: SEARCH_PARAMS.avatar, value: model },
        { name: SEARCH_PARAMS.isTranparent, value: isTransparent },
        { name: SEARCH_PARAMS.isShowText, value: isShowText },
        { name: SEARCH_PARAMS.fontColor, value: interfaceFontColor.slice(1) },
        { name: SEARCH_PARAMS.bcColor, value: bcColor.slice(1) },
        { name: SEARCH_PARAMS.animationDuration, value: animationDuration },
        { name: SEARCH_PARAMS.hasAvatarShadow, value: hasAvatarShadow },
        { name: SEARCH_PARAMS.progressBar.isShow, value: progressBar.isShow },
        { name: SEARCH_PARAMS.progressBar.isFixAmount, value: progressBar.isFixAmount },
        { name: SEARCH_PARAMS.progressBar.fixAmount, value: progressBar.fixAmount },
        { name: SEARCH_PARAMS.isShowQr, value: isShowQr },
      ]
        .map(
          ({ name, value }, idx) =>
            `${idx === 0 ? `?${SEARCH_PARAMS.utmContent}=${UTM.content.isWidgetMode}&` : '&'}${name}=${value}`,
        )
        .join(''),
    [
      animationDuration,
      bcColor,
      hasAvatarShadow,
      interfaceFontColor,
      isShowQr,
      isShowText,
      isTransparent,
      progressBar,
      model,
    ],
  );

  const windowLocationOrigin = useMemo(() => getWindowLocationOrigin(), []);

  const avatar = useMemo(() => {
    const setup: Record<Avatar, { name: Avatar; sceneEnvironment: SceneEnvironment; component: ReactNode }> = {
      mouse: {
        name: 'mouse',
        sceneEnvironment: 'lobby',
        component: (
          <MouseComponent
            isCastShadow={hasAvatarShadow}
            position={[0, 0, 0]}
            animationIndex={animationIndex}
          />
        ),
      },
      sorceress: {
        name: 'sorceress',
        sceneEnvironment: 'forest',
        component: (
          <SorceressComponent
            isCastShadow={hasAvatarShadow}
            position={[0, 0, 0]}
            animationIndex={animationIndex}
          />
        ),
      },
      bender: {
        name: 'bender',
        sceneEnvironment: 'forest',
        component: (
          <BenderComponent
            isCastShadow={hasAvatarShadow}
            position={[0, 0, 0]}
            animationIndex={animationIndex}
          />
        ),
      },
      qrCat: {
        name: 'qrCat',
        sceneEnvironment: 'forest',
        component: (
          <QrCatComponent
          // isCastShadow={hasAvatarShadow}
          // animationIndex={animationIndex}
          />
        ),
      },
      toyota: {
        name: 'toyota',
        sceneEnvironment: 'city',
        component: (
          <ToyotaComponent
          // isCastShadow={hasAvatarShadow}
          // animationIndex={animationIndex}
          />
        ),
      },
      pumpkin: {
        name: 'pumpkin',
        sceneEnvironment: 'city',
        component: (
          <PumpkinComponent
            isCastShadow={hasAvatarShadow}
            animationIndex={animationIndex}
          />
        ),
      },
    };

    return setup[model];
  }, [animationIndex, hasAvatarShadow, model]);

  const { name, description, jarAmount, jarGoal } = jarData;

  return (
    <div style={{ backgroundColor: isTransparent ? 'transparent' : bcColor }}>
      {!isWidgetMode && (
        <Button
          sx={{
            position: 'absolute',
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

      <Drawer
        open={isVisibleSidebar}
        onClose={handleHideSideBar}
      >
        <Stack
          spacing={3}
          sx={{ padding: '16px 8px' }}
          className={inter.className}
        >
          <SidebarHeader onClose={handleHideSideBar} />

          <JarSettings
            inputJarId={inputJarId}
            onInputChange={setInputJarId}
            onSubmit={handleJarIdSubmit}
            fetchError={fetchError}
            isDisabled={inputJarId.length < 7}
          />

          <InterfaceSettings
            bcColor={bcColor}
            isTransparent={isTransparent}
            interfaceFontColor={interfaceFontColor}
            isShowText={isShowText}
            progressBar={progressBar}
            isShowQr={isShowQr}
            jarAmount={jarAmount}
            jarGoal={jarGoal}
            onBcColorChange={handlePickerBcColor}
            onTransparentChange={handleTransparent}
            onFontColorChange={handleInterfaceFontColor}
            onShowTextToggle={handleIsShowInterfaceText}
            onProgressBarChange={handleProgressBar}
            onShowQrChange={handleIsShowQr}
          />

          <ProgressBarSettings
            progressBar={progressBar}
            onProgressBarChange={handleProgressBar}
          />

          <AvatarSettings
            animationDuration={animationDuration}
            hasAvatarShadow={hasAvatarShadow}
            onAnimationDurationChange={setAnimationDuration}
            onAvatarShadowToggle={handleAvatarShadow}
            avatarOption={model}
            onAvatarChange={handleChangeAvatar}
          />

          <StreamingLinkSettings
            windowLocationOrigin={windowLocationOrigin}
            pathname={pathname}
            makeSearchParams={makeSearchParams}
          />
        </Stack>
      </Drawer>

      <div style={{ display: 'grid', height: '100vh' }}>
        {isShowText && (
          <Header
            name={name}
            interfaceFontColor={interfaceFontColor}
            jarGoal={jarGoal / 100}
            jarAmount={jarAmount / 100}
          />
        )}

        {avatar && <Scene sceneEnvironment={avatar.sceneEnvironment}>{avatar.component}</Scene>}

        <Box
          sx={{
            display: 'grid',
            gap: 1,
            p: 0.5,
            gridTemplateColumns: 'minmax(150px, auto) minmax(auto, 500px) minmax(150px, auto)',
            alignItems: 'end',
          }}
        >
          <Box sx={{ gridColumn: '1 / 2', gridRow: '1 / 2' }}>
            {!isWidgetMode && (
              <StatusBar
                isLoading={isLoading}
                jarAmount={jarAmount}
                jarGoal={jarGoal}
                fetchError={fetchError}
              />
            )}
          </Box>

          <Box
            sx={{
              gridColumn: '2 / 3',
              gridRow: '1 / 2',
              textAlign: 'center',
              display: 'grid',
              gap: 3,
            }}
          >
            {progressBar.isShow && (
              <JarProgressBar
                jarAmount={jarAmount}
                jarGoal={jarGoal}
                interfaceFontColor={interfaceFontColor}
                fixedAmount={progressBar.fixAmount}
                isFixAmount={progressBar.isFixAmount}
              />
            )}

            {isShowText && (
              <Footer
                description={description}
                interfaceFontColor={interfaceFontColor}
              />
            )}
          </Box>

          <Box
            sx={{
              gridColumn: '3 / 4',
              gridRow: '1 / 2',
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <Qr
              isShow={isShowQr && !fetchError}
              clientId={clientId}
              light={isTransparent ? 'ffffff' : bcColor.slice(1)}
              dark={interfaceFontColor.slice(1)}
            />
          </Box>
        </Box>
      </div>
    </div>
  );
}

export default memo(JarPage);
