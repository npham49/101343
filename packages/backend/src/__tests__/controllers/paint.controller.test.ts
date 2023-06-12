import { Request } from "express";
import {
  getAllPaints,
  getPaint,
  updatePaint,
  createPaint,
  deletePaint,
} from "../../controllers/paint.controller";
import {
  getAllPaints as getAllPaintsService,
  getPaint as getPaintService,
  updatePaint as updatePaintService,
  createPaint as createPaintService,
  deletePaint as deletePaintService,
} from "../../services/paint.service";
import decode from "../../auth/auth";
import mock from "jest-mock-extended/lib/Mock";

jest.mock("../../auth/auth");
jest.mock("../../services/paint.service");

describe("getAllPaints", () => {
  let mockRequest: any;
  let mockResponse: any;

  beforeEach(() => {
    mockRequest = {
      headers: {
        authorization: "Bearer token",
      },
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return all paints when authenticated and authorized", async () => {
    (decode as jest.Mock).mockReturnValue({
      decoded: { metadata: { role: "edit" } },
    });
    (getAllPaintsService as jest.Mock).mockResolvedValue([
      {
        id: 0,
        name: "Paint 1",
        stock: 10,
        status: "Available",
        updatedAt: new Date(),
      },
      {
        id: 2,
        name: "Paint 2",
        stock: 5,
        status: "Running Low",
        updatedAt: new Date(),
      },
    ]);
    await getAllPaints(mockRequest, mockResponse);
    // console.log(mockResponse.json)

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith([
      {
        id: 0,
        name: "Paint 1",
        stock: 10,
        status: "Available",
        updatedAt: expect.any(Date),
      },
      {
        id: 2,
        name: "Paint 2",
        stock: 5,
        status: "Running Low",
        updatedAt: expect.any(Date),
      },
    ]);
  });

  it("should return a 401 status code if authentication fails", async () => {
    (decode as jest.Mock).mockReturnValue({ error: "Invalid token" });

    await getAllPaints(mockRequest as Request, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.send).toHaveBeenCalledWith("Invalid token");
  });

  it("should return a 500 status code and error message on server error", async () => {
    (decode as jest.Mock).mockReturnValue({
      decoded: { metadata: { role: "edit" } },
    });
    (getAllPaintsService as jest.Mock).mockRejectedValue(
      new Error("test_error")
    );

    await getAllPaints(mockRequest as Request, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.send).toHaveBeenCalledWith("Internal Server Error");
  });
});

describe("getPaint", () => {
  let mockRequest: any;
  let mockResponse: any;

  beforeEach(() => {
    mockRequest = {
      headers: {
        authorization: "Bearer token",
      },
      params: {
        id: 0,
      },
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return all paints when authenticated and authorized", async () => {
    (decode as jest.Mock).mockReturnValue({
      decoded: { metadata: { role: "edit" } },
    });
    (getPaintService as jest.Mock).mockResolvedValue({
      id: 0,
      name: "Paint 1",
      stock: 10,
      status: "Available",
      updatedAt: new Date(),
    });
    await getPaint(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      id: 0,
      name: "Paint 1",
      stock: 10,
      status: "Available",
      updatedAt: expect.any(Date),
    });
  });

  it("should return a 401 status code if authentication fails", async () => {
    (decode as jest.Mock).mockReturnValue({ error: "Invalid token" });

    await getPaint(mockRequest as Request, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.send).toHaveBeenCalledWith("Invalid token");
  });

  it("should return a 500 status code and error message on server error", async () => {
    (decode as jest.Mock).mockReturnValue({
      decoded: { metadata: { role: "edit" } },
    });
    (getPaintService as jest.Mock).mockRejectedValue(new Error("test_error"));

    await getPaint(mockRequest as Request, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.send).toHaveBeenCalledWith("Internal Server Error");
  });
});

describe("updatePaint", () => {
  let mockRequest: any;
  let mockResponse: any;
  beforeEach(() => {
    mockRequest = {
      headers: {
        authorization: "Bearer token",
      },
      params: {
        id: 0,
      },
      body: {
        name: "Paint 1",
        stock: 10,
        status: "Available",
      },
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return an updated object on success and edit roles on token", async () => {
    (decode as jest.Mock).mockReturnValue({
      decoded: { metadata: { role: "edit" } },
    });
    (updatePaintService as jest.Mock).mockResolvedValue({
      id: 0,
      name: "Paint 1",
      stock: 10,
      status: "Available",
      updatedAt: new Date(),
    });

    await updatePaint(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      id: 0,
      name: "Paint 1",
      stock: 10,
      status: "Available",
      updatedAt: expect.any(Date),
    });
  });

  it("should return a 401 on read roles on token", async () => {
    (decode as jest.Mock).mockReturnValue({
      decoded: { metadata: { role: "read" } },
    });
    (updatePaintService as jest.Mock).mockResolvedValue({
      id: 0,
      name: "Paint 1",
      stock: 10,
      status: "Available",
      updatedAt: new Date(),
    });

    await updatePaint(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.send).toHaveBeenCalledWith("Not Authorized");
  });

  it("should return a 500 status code and error message on server error", async () => {
    (decode as jest.Mock).mockReturnValue({
      decoded: { metadata: { role: "edit" } },
    });
    (updatePaintService as jest.Mock).mockRejectedValue(
      new Error("test_error")
    );

    await updatePaint(mockRequest as Request, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.send).toHaveBeenCalledWith("Internal Server Error");
  });
});

describe("deletePaint", () => {
  let mockRequest: any;
  let mockResponse: any;
  beforeEach(() => {
    mockRequest = {
      headers: {
        authorization: "Bearer token",
      },
      params: {
        id: 0,
      },
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return a 200 status code on success and edit roles on token", async () => {
    (decode as jest.Mock).mockReturnValue({
      decoded: { metadata: { role: "edit" } },
    });
    (deletePaintService as jest.Mock).mockResolvedValue({
      id: 0,
      name: "Paint 1",
      stock: 10,
      status: "Available",
      updatedAt: new Date(),
    });

    await deletePaint(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      id: 0,
      name: "Paint 1",
      stock: 10,
      status: "Available",
      updatedAt: expect.any(Date),
    });
  });

  it("should return a 401 on read roles on token", async () => {
    (decode as jest.Mock).mockReturnValue({
      decoded: { metadata: { role: "read" } },
    });
    (deletePaintService as jest.Mock).mockResolvedValue({
      id: 0,
      name: "Paint 1",
      stock: 10,
      status: "Available",
      updatedAt: new Date(),
    });

    await deletePaint(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.send).toHaveBeenCalledWith("Not Authorized");
  });

  it("should return a 500 status code and error message on server error", async () => {
    (decode as jest.Mock).mockReturnValue({
      decoded: { metadata: { role: "edit" } },
    });
    (deletePaintService as jest.Mock).mockRejectedValue(
      new Error("test_error")
    );

    await deletePaint(mockRequest as Request, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.send).toHaveBeenCalledWith("Internal Server Error");
  });
});

describe("createPaint", () => {
  let mockRequest: any;
  let mockResponse: any;
  beforeEach(() => {
    mockRequest = {
      headers: {
        authorization: "Bearer token",
      },
      body: {
        name: "Paint 1",
        stock: 10,
        status: "Available",
      },
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return a 200 status code on success and edit roles on token", async () => {
    (decode as jest.Mock).mockReturnValue({
      decoded: { metadata: { role: "edit" } },
    });
    (createPaintService as jest.Mock).mockResolvedValue({
      id: 0,
      name: "Paint 1",
      stock: 10,
      status: "Available",
      updatedAt: new Date(),
    });

    await createPaint(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      id: 0,
      name: "Paint 1",
      stock: 10,
      status: "Available",
      updatedAt: expect.any(Date),
    });
  });

  it("should return a 401 on read roles on token", async () => {
    (decode as jest.Mock).mockReturnValue({
      decoded: { metadata: { role: "read" } },
    });
    (createPaintService as jest.Mock).mockResolvedValue({
      id: 0,
      name: "Paint 1",
      stock: 10,
      status: "Available",
      updatedAt: new Date(),
    });

    await createPaint(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.send).toHaveBeenCalledWith("Not Authorized");
  });

  it("should return a 500 status code and error message on server error", async () => {
    (decode as jest.Mock).mockReturnValue({
      decoded: { metadata: { role: "edit" } },
    });
    (createPaintService as jest.Mock).mockRejectedValue(
      new Error("test_error")
    );

    await createPaint(mockRequest as Request, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.send).toHaveBeenCalledWith("Internal Server Error");
  });
});
