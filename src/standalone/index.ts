// Copyright (c) Microsoft Corporation.

// Export DAP infrastructure
export { DAPClient, DAPMessage, DAPRequest, DAPResponse, DAPEvent } from './DAPClient';
export { DebugAdapterManager, AdapterProcess } from './DebugAdapterManager';
export { ConfigLoader, AdapterConfig, DefaultConfig, StandaloneConfig } from './ConfigLoader';
export { DebugStateTracker, SessionState, FrameInfo, ThreadInfo } from './DebugStateTracker';

// Export standalone backend
export { StandaloneDAPBackend } from './StandaloneDAPBackend';

// Export instruction builder for dynamic documentation
export { InstructionBuilder, AdapterValidationResult, ConfigValidationResult } from './InstructionBuilder';

// Export server entry point
export { main as startStandaloneServer, initConfig } from './StandaloneServer';
